#!/bin/bash

# Base URL
API_URL="http://localhost:8787/api/v1"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Starting API Tests..."

echo "0. Seeding Initial Data..."
curl -s -X POST "$API_URL/seed" -H "Content-Type: application/json" | grep "\"success\":true" > /dev/null && echo -e "${GREEN}✅ Seeded${NC}" || echo -e "${RED}❌ Seed Failed${NC}"

# 1. Generate Test Token (Bypass Google Auth for local test)
echo "1. Generating Test Token..."
# Using tsx or node to run the script. Assuming tsx is available or compile. 
# Since this is local dev environment with npm run dev, we might not have direct tsx.
# We can use `npx tsx scripts/generate_test_token.ts`
GEN_RES=$(npx tsx scripts/generate_test_token.ts)
MOCK_TOKEN=$(echo $GEN_RES | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
USER_ID=$(echo $GEN_RES | python3 -c "import sys, json; print(json.load(sys.stdin)['userId'])")

echo "   User ID: $USER_ID"
echo "   Token: $MOCK_TOKEN"

if [ -z "$MOCK_TOKEN" ]; then
    echo -e "${RED}❌ Token Gen Failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Token Generated${NC}"

# We need to ensure the user exists in DB for foreign keys (deeds etc) to work?
# The `generate_test_token.ts` just makes a token. It doesn't insert user into DB.
# Middleware checks `getUser(db, userId)`. If user not found -> 401.
# So we MUST insert the user first. 
# We can use the `/api/v1/seed` endpoint? No, seed adds categories.
# We can't use /auth/google without code.
# We can manually insert user via sql or expose a temporary `create_test_user` endpoint?
# Or update `seed.ts` to include a test user? 
# Or update `generate_test_token.ts` to also call a DB command? No D1 access easily from script unless using wrangler d1 execute.

# Let's use `wrangler d1 execute` to insert the test user!
echo "   Inserting Test User into DB..."
npx wrangler d1 execute DB --local --command "INSERT INTO users (id, email, display_name, created_at, updated_at) VALUES ('$USER_ID', 'test@example.com', 'Test User', $(date +%s)*1000, $(date +%s)*1000)" > /dev/null

echo -e "${GREEN}✅ Test User Inserted${NC}"

# Helper headers
AUTH_HEADER="Authorization: Bearer $MOCK_TOKEN"

CONTENT_TYPE="Content-Type: application/json"

# 2. Get Categories
echo "2. Getting Categories..."
curl -s -X GET "$API_URL/categories" -H "$AUTH_HEADER" | grep "\"success\":true" > /dev/null && echo -e "${GREEN}✅ Categories OK${NC}" || echo -e "${RED}❌ Categories Failed${NC}"

# 3. Create Goal
echo "3. Creating Goal..."
GOAL_RES=$(curl -s -X POST "$API_URL/goals" \
  -H "$AUTH_HEADER" -H "$CONTENT_TYPE" \
  -d '{"type": "daily", "targetCount": 3}')
GOAL_ID=$(echo $GOAL_RES | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])")

if [ -n "$GOAL_ID" ] && [ "$GOAL_ID" != "null" ]; then
    echo -e "${GREEN}✅ Goal Created ($GOAL_ID)${NC}"
else
    echo -e "${RED}❌ Create Goal Failed${NC}"
    echo $GOAL_RES
fi

# 4. Create Deed (triggering achievements)
echo "4. Creating Deed..."
DEED_RES=$(curl -s -X POST "$API_URL/deeds" \
  -H "$AUTH_HEADER" -H "$CONTENT_TYPE" \
    -d '{"categoryCode": "body", "description": "Helping test"}')
DEED_ID=$(echo $DEED_RES | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])")

if [ -n "$DEED_ID" ] && [ "$DEED_ID" != "null" ]; then
    echo -e "${GREEN}✅ Deed Created ($DEED_ID)${NC}"
else
    echo -e "${RED}❌ Create Deed Failed${NC}"
    echo $DEED_RES
fi

# 5. Check Stats
echo "5. Checking Stats..."
STATS_RES=$(curl -s -X GET "$API_URL/stats/summary" -H "$AUTH_HEADER")
TOTAL=$(echo $STATS_RES | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['totalDeeds'])")

if [ "$TOTAL" -ge 1 ]; then
    echo -e "${GREEN}✅ Stats OK (Total: $TOTAL)${NC}"
else
    echo -e "${RED}❌ Stats Incorrect${NC}"
    echo $STATS_RES
fi

# 6. Check Achievements (First Deed should be unlocked)
echo "6. Checking Achievements..."
ACH_RES=$(curl -s -X GET "$API_URL/achievements" -H "$AUTH_HEADER")
# Check if list is not empty
ACH_COUNT=$(echo $ACH_RES | python3 -c "import sys, json; print(len(json.load(sys.stdin)['data']))")

if [ "$ACH_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Achievements Unlocked ($ACH_COUNT)${NC}"
else
    echo -e "${RED}❌ No Achievements Unlocked${NC}"
    echo $ACH_RES
fi

# 7. Update User Settings
echo "7. Updating Settings..."
curl -s -X PUT "$API_URL/reminders/settings" \
  -H "$AUTH_HEADER" -H "$CONTENT_TYPE" \
  -d '{"reminderEnabled": true, "reminderTime": "20:00"}' | grep "\"success\":true" > /dev/null && echo -e "${GREEN}✅ Settings Updated${NC}" || echo -e "${RED}❌ Settings Update Failed${NC}"

echo "🎉 Test Sequence Completed!"
