#!/bin/bash

# Test script cho My Locket Backend (Local)
# Chạy dev server trước: npm run dev

BASE_URL="http://localhost:8787"
TEST_UID="test-uid-$(date +%s)"
TEST_EMAIL="test-$(date +%s)@example.com"

echo "=================================="
echo "My Locket Backend - Local Test"
echo "=================================="
echo ""
echo "Base URL: $BASE_URL"
echo "Test UID: $TEST_UID"
echo "Test Email: $TEST_EMAIL"
echo ""

# Test 1: Sync user
echo "📝 Test 1: POST /users/sync"
SYNC_RESPONSE=$(curl -s -X POST "$BASE_URL/users/sync" \
  -H "Content-Type: application/json" \
  -d "{
    \"firebaseUid\": \"$TEST_UID\",
    \"email\": \"$TEST_EMAIL\",
    \"displayName\": \"Test User\",
    \"photoURL\": \"https://example.com/photo.jpg\"
  }")

echo "$SYNC_RESPONSE" | jq '.'
echo ""

# Extract user ID
USER_ID=$(echo "$SYNC_RESPONSE" | jq -r '.data.id')
echo "✅ User created with ID: $USER_ID"
echo ""

# Test 2: Get user me
echo "📝 Test 2: GET /users/me"
curl -s "$BASE_URL/users/me" \
  -H "Authorization: Bearer $TEST_UID" | jq '.'
echo ""

# Test 3: Update user
echo "📝 Test 3: PATCH /users/me"
curl -s -X PATCH "$BASE_URL/users/me" \
  -H "Authorization: Bearer $TEST_UID" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Updated Test User",
    "birthday": "1998-01-01",
    "bio": "This is my bio"
  }' | jq '.'
echo ""

# Test 4: Create multiple posts (để test calendar count)
echo "📝 Test 4: POST /posts (creating 3 posts on same day)"
# Tạo timestamp cho hôm nay lúc 10:00 AM (đảm bảo cùng 1 ngày)
TODAY_TIMESTAMP=$(date +%s)000  # Current timestamp in milliseconds

# Post 1 (10:00 AM)
POST_RESPONSE_1=$(curl -s -X POST "$BASE_URL/posts" \
  -H "Authorization: Bearer $TEST_UID" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaPublicId": "test/post1",
    "mediaUrl": "https://example.com/image1.jpg",
    "mediaType": "image",
    "attributes": {
      "caption": "Test post 1",
      "emotion": "happy"
    },
    "createdAt": '${TODAY_TIMESTAMP}'
  }')

echo "Post 1:" 
echo "$POST_RESPONSE_1" | jq '.'

# Post 2 (same day, 1 hour later = 11:00 AM)
POST_RESPONSE_2=$(curl -s -X POST "$BASE_URL/posts" \
  -H "Authorization: Bearer $TEST_UID" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaPublicId": "test/post2",
    "mediaUrl": "https://example.com/image2.jpg",
    "mediaType": "image",
    "attributes": {
      "caption": "Test post 2",
      "emotion": "excited"
    },
    "createdAt": '$((TODAY_TIMESTAMP + 3600000))'
  }')

echo "Post 2:"
echo "$POST_RESPONSE_2" | jq '.'

# Post 3 (same day, 2 hours later = 12:00 PM - latest)
POST_RESPONSE_3=$(curl -s -X POST "$BASE_URL/posts" \
  -H "Authorization: Bearer $TEST_UID" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaPublicId": "test/post3",
    "mediaUrl": "https://example.com/image3.jpg",
    "mediaType": "image",
    "attributes": {
      "caption": "Test post 3 - Latest",
      "emotion": "love"
    },
    "createdAt": '$((TODAY_TIMESTAMP + 7200000))'
  }')

echo "Post 3:"
echo "$POST_RESPONSE_3" | jq '.'
echo ""

POST_ID=$(echo "$POST_RESPONSE_3" | jq -r '.data.id')
echo "✅ Created 3 posts, latest ID: $POST_ID"
echo ""

# Test 5: Get feed
echo "📝 Test 5: GET /feed"
curl -s "$BASE_URL/feed?limit=10" \
  -H "Authorization: Bearer $TEST_UID" | jq '.'
echo ""

# Test 6: Get posts/me
echo "📝 Test 6: GET /posts/me"
curl -s "$BASE_URL/posts/me" \
  -H "Authorization: Bearer $TEST_UID" | jq '.'
echo ""

# Test 7: Get post by ID
echo "📝 Test 7: GET /posts/$POST_ID"
curl -s "$BASE_URL/posts/$POST_ID" \
  -H "Authorization: Bearer $TEST_UID" | jq '.'
echo ""

# Test 8: Get calendar (should show count=3 for today)
echo "📝 Test 8: GET /activities/calendar"
CURRENT_MONTH=$(date +%Y-%m)
CALENDAR_RESPONSE=$(curl -s "$BASE_URL/activities/calendar?from=$CURRENT_MONTH&to=$CURRENT_MONTH" \
  -H "Authorization: Bearer $TEST_UID")

echo "$CALENDAR_RESPONSE" | jq '.'
echo ""

# Verify calendar response structure
CALENDAR_COUNT=$(echo "$CALENDAR_RESPONSE" | jq -r '.data.months[0].days[0].count // 0')
CALENDAR_MEDIA_URL=$(echo "$CALENDAR_RESPONSE" | jq -r '.data.months[0].days[0].mediaUrl // "null"')
echo "✅ Calendar verification:"
echo "  - Posts count today: $CALENDAR_COUNT (expected: 3)"
echo "  - Latest post mediaUrl: $CALENDAR_MEDIA_URL (expected: image3.jpg)"
echo ""

# Test 9: Get streak (should show currentStreak=1, longestStreak=1)
echo "📝 Test 9: GET /activities/streak"
STREAK_RESPONSE=$(curl -s "$BASE_URL/activities/streak" \
  -H "Authorization: Bearer $TEST_UID")

echo "$STREAK_RESPONSE" | jq '.'
echo ""

CURRENT_STREAK=$(echo "$STREAK_RESPONSE" | jq -r '.data.currentStreak // 0')
LONGEST_STREAK=$(echo "$STREAK_RESPONSE" | jq -r '.data.longestStreak // 0')
echo "✅ Streak verification:"
echo "  - Current streak: $CURRENT_STREAK day(s)"
echo "  - Longest streak: $LONGEST_STREAK day(s)"
echo ""

# Test 10: Create second user for friend testing
echo "📝 Test 10: Create second user for friend testing"
TEST_UID_2="test-uid-friend-$(date +%s)"
TEST_EMAIL_2="friend-$(date +%s)@example.com"

SYNC_RESPONSE_2=$(curl -s -X POST "$BASE_URL/users/sync" \
  -H "Content-Type: application/json" \
  -d "{
    \"firebaseUid\": \"$TEST_UID_2\",
    \"email\": \"$TEST_EMAIL_2\",
    \"displayName\": \"Friend User\",
    \"photoURL\": \"https://example.com/friend.jpg\"
  }")

echo "$SYNC_RESPONSE_2" | jq '.'
echo ""

USER_ID_2=$(echo "$SYNC_RESPONSE_2" | jq -r '.data.id')
echo "✅ Friend user created with ID: $USER_ID_2"
echo ""

# Test 11: Search user by email
echo "📝 Test 11: GET /users/search?email=$TEST_EMAIL_2"
SEARCH_RESPONSE=$(curl -s "$BASE_URL/users/search?email=$TEST_EMAIL_2" \
  -H "Authorization: Bearer $TEST_UID")

echo "$SEARCH_RESPONSE" | jq '.'
echo ""

# Test 12: Send friend request
echo "📝 Test 12: POST /friends/requests"
FRIEND_REQUEST_RESPONSE=$(curl -s -X POST "$BASE_URL/friends/requests" \
  -H "Authorization: Bearer $TEST_UID" \
  -H "Content-Type: application/json" \
  -d "{
    \"toUserId\": $USER_ID_2
  }")

echo "$FRIEND_REQUEST_RESPONSE" | jq '.'
echo ""

FRIEND_REQUEST_ID=$(echo "$FRIEND_REQUEST_RESPONSE" | jq -r '.data.id // 0')
echo "✅ Friend request sent with ID: $FRIEND_REQUEST_ID"
echo ""

# Test 13: Get friend requests (as receiver)
echo "📝 Test 13: GET /friends/requests (as receiver)"
FRIEND_REQUESTS_RESPONSE=$(curl -s "$BASE_URL/friends/requests" \
  -H "Authorization: Bearer $TEST_UID_2")

echo "$FRIEND_REQUESTS_RESPONSE" | jq '.'
echo ""

# Extract friend request ID from response
FRIEND_REQUEST_ID=$(echo "$FRIEND_REQUESTS_RESPONSE" | jq -r '.data[0].id // 0')
echo "✅ Friend request ID to accept: $FRIEND_REQUEST_ID"
echo ""

# Test 14: Accept friend request
echo "📝 Test 14: POST /friends/requests/$FRIEND_REQUEST_ID/accept"
curl -s -X POST "$BASE_URL/friends/requests/$FRIEND_REQUEST_ID/accept" \
  -H "Authorization: Bearer $TEST_UID_2" \
  -H "Content-Type: application/json" | jq '.'
echo ""

# Test 15: Get friends list
echo "📝 Test 15: GET /friends (both users)"
echo "User 1 friends:"
curl -s "$BASE_URL/friends" \
  -H "Authorization: Bearer $TEST_UID" | jq '.'
echo ""

echo "User 2 friends:"
curl -s "$BASE_URL/friends" \
  -H "Authorization: Bearer $TEST_UID_2" | jq '.'
echo ""

# Test 16: Add reaction
echo "📝 Test 16: POST /posts/$POST_ID/reactions"
curl -s -X POST "$BASE_URL/posts/$POST_ID/reactions" \
  -H "Authorization: Bearer $TEST_UID" \
  -H "Content-Type: application/json" \
  -d '{
    "reactionType": "heart"
  }' | jq '.'
echo ""

# Test 17: Get reactions
echo "📝 Test 17: GET /posts/$POST_ID/reactions"
curl -s "$BASE_URL/posts/$POST_ID/reactions" \
  -H "Authorization: Bearer $TEST_UID" | jq '.'
echo ""

echo "=================================="
echo "✅ All tests completed!"
echo "=================================="
echo ""
echo "Test summary:"
echo "  User 1 UID: $TEST_UID"
echo "  User 1 Email: $TEST_EMAIL"
echo "  User 1 ID: $USER_ID"
echo ""
echo "  User 2 UID: $TEST_UID_2"
echo "  User 2 Email: $TEST_EMAIL_2"
echo "  User 2 ID: $USER_ID_2"
echo ""
echo "  Posts created: 3 (same day)"
echo "  Latest Post ID: $POST_ID"
echo "  Friend request ID: $FRIEND_REQUEST_ID"
echo ""
echo "  Calendar count today: $CALENDAR_COUNT (expected: 3)"
echo "  Current streak: $CURRENT_STREAK"
echo "  Longest streak: $LONGEST_STREAK"
echo ""
