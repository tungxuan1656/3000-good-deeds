-- Script để thêm dữ liệu test vào database
-- FirebaseUid: piRPVX01bGc4XDDaKFXjCnfb8e12

-- Insert test user 1 (từ JWT token mẫu)
INSERT OR IGNORE INTO users (firebase_uid, email, display_name, username, avatar_url, bio, birthday, created_at, updated_at)
VALUES (
  'piRPVX01bGc4XDDaKFXjCnfb8e12',
  'tungxuan.temp@gmail.com',
  'Tùng Xuân',
  'tung_xuan',
  'https://lh3.googleusercontent.com/a/ACg8ocLm7p6F60xNXL59ZxTUg0ppSzeB81ko5tpB7AMcLmFg6VvKdA=s96-c',
  'Founder of My Locket 📸',
  '1998-01-01',
  1764921733000,
  1764921733000
);

-- Insert test user 2 (bạn bè test)
INSERT OR IGNORE INTO users (firebase_uid, email, display_name, username, avatar_url, bio, birthday, created_at, updated_at)
VALUES (
  'test-friend-uid-001',
  'friend@example.com',
  'Friend User',
  'friend_user',
  'https://example.com/avatar2.jpg',
  'Best friend 👫',
  '1999-02-02',
  1764921734000,
  1764921734000
);

-- Insert test user 3 (bạn bè test khác)
INSERT OR IGNORE INTO users (firebase_uid, email, display_name, username, avatar_url, bio, birthday, created_at, updated_at)
VALUES (
  'test-friend-uid-002',
  'another-friend@example.com',
  'Another Friend',
  'another_friend',
  'https://example.com/avatar3.jpg',
  'Also awesome 🎉',
  '2000-03-03',
  1764921735000,
  1764921735000
);

-- Insert test user 4 (bạn bè mới 1)
INSERT OR IGNORE INTO users (firebase_uid, email, display_name, username, avatar_url, bio, birthday, created_at, updated_at)
VALUES (
  'test-friend-uid-003',
  'newfriend1@example.com',
  'New Friend 1',
  'new_friend_1',
  'https://example.com/avatar4.jpg',
  'New friend number 1',
  '2001-04-04',
  1764921735100,
  1764921735100
);

-- Insert test user 5 (bạn bè mới 2)
INSERT OR IGNORE INTO users (firebase_uid, email, display_name, username, avatar_url, bio, birthday, created_at, updated_at)
VALUES (
  'test-friend-uid-004',
  'newfriend2@example.com',
  'New Friend 2',
  'new_friend_2',
  'https://example.com/avatar5.jpg',
  'New friend number 2',
  '2002-05-05',
  1764921735200,
  1764921735200
);

-- Insert posts cho user 1 (3 posts cùng ngày hôm nay)
-- Lấy user_id từ bảng users
WITH user_data AS (
  SELECT id FROM users WHERE firebase_uid = 'piRPVX01bGc4XDDaKFXjCnfb8e12'
)
INSERT OR IGNORE INTO posts (user_id, media_public_id, media_url, media_type, width, height, created_at, updated_at)
SELECT 
  (SELECT id FROM user_data),
  'test/my-locket/post-1',
  'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1000',
  'image',
  1000,
  1200,
  (SELECT CAST((strftime('%s', 'now') || '000') AS INTEGER)) - 7200000, -- 2 hours ago
  (SELECT CAST((strftime('%s', 'now') || '000') AS INTEGER)) - 7200000
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE media_public_id = 'test/my-locket/post-1');

-- Post 2 (1 hour ago)
WITH user_data AS (
  SELECT id FROM users WHERE firebase_uid = 'piRPVX01bGc4XDDaKFXjCnfb8e12'
)
INSERT OR IGNORE INTO posts (user_id, media_public_id, media_url, media_type, width, height, created_at, updated_at)
SELECT 
  (SELECT id FROM user_data),
  'test/my-locket/post-2',
  'https://images.unsplash.com/photo-1516321318423-f06f70259b0c?w=1000',
  'image',
  1000,
  1200,
  (SELECT CAST((strftime('%s', 'now') || '000') AS INTEGER)) - 3600000, -- 1 hour ago
  (SELECT CAST((strftime('%s', 'now') || '000') AS INTEGER)) - 3600000
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE media_public_id = 'test/my-locket/post-2');

-- Post 3 (30 minutes ago - latest)
WITH user_data AS (
  SELECT id FROM users WHERE firebase_uid = 'piRPVX01bGc4XDDaKFXjCnfb8e12'
)
INSERT OR IGNORE INTO posts (user_id, media_public_id, media_url, media_type, width, height, created_at, updated_at)
SELECT 
  (SELECT id FROM user_data),
  'test/my-locket/post-3',
  'https://images.unsplash.com/photo-1618519764d47-daf6aa28c70f?w=1000',
  'image',
  1000,
  1200,
  (SELECT CAST((strftime('%s', 'now') || '000') AS INTEGER)) - 1800000, -- 30 minutes ago
  (SELECT CAST((strftime('%s', 'now') || '000') AS INTEGER)) - 1800000
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE media_public_id = 'test/my-locket/post-3');

-- Insert post attributes cho 3 posts
-- Post 1 attributes
WITH post_data AS (
  SELECT id FROM posts WHERE media_public_id = 'test/my-locket/post-1'
)
INSERT OR IGNORE INTO post_attributes (post_id, caption, emotion, location_name, location_lat, location_lng, extra)
SELECT 
  (SELECT id FROM post_data),
  'Beautiful sunset at the beach 🌅',
  'happy',
  'Santa Monica Beach, Los Angeles',
  34.0195,
  -118.4912,
  '{"filtered": true, "filter_name": "Warm"}'
WHERE NOT EXISTS (SELECT 1 FROM post_attributes WHERE post_id = (SELECT id FROM post_data));

-- Post 2 attributes
WITH post_data AS (
  SELECT id FROM posts WHERE media_public_id = 'test/my-locket/post-2'
)
INSERT OR IGNORE INTO post_attributes (post_id, caption, emotion, location_name, location_lat, location_lng, extra)
SELECT 
  (SELECT id FROM post_data),
  'Coffee with a friend ☕',
  'peaceful',
  'Coffee Shop, Downtown',
  34.0522,
  -118.2437,
  '{"filtered": true, "filter_name": "Cool"}'
WHERE NOT EXISTS (SELECT 1 FROM post_attributes WHERE post_id = (SELECT id FROM post_data));

-- Post 3 attributes (latest)
WITH post_data AS (
  SELECT id FROM posts WHERE media_public_id = 'test/my-locket/post-3'
)
INSERT OR IGNORE INTO post_attributes (post_id, caption, emotion, location_name, location_lat, location_lng, extra)
SELECT 
  (SELECT id FROM post_data),
  'Living my best life! 💫 #memories',
  'excited',
  'Hollywood Hills, Los Angeles',
  34.1262,
  -118.3410,
  '{"filtered": true, "filter_name": "Vibrant"}'
WHERE NOT EXISTS (SELECT 1 FROM post_attributes WHERE post_id = (SELECT id FROM post_data));

-- Insert friend requests
-- Friend request 1: User 1 -> Friend User 2
WITH requester AS (
  SELECT id FROM users WHERE firebase_uid = 'piRPVX01bGc4XDDaKFXjCnfb8e12'
),
receiver AS (
  SELECT id FROM users WHERE firebase_uid = 'test-friend-uid-001'
)
INSERT OR IGNORE INTO friends (requester_id, receiver_id, status, created_at, updated_at)
SELECT 
  (SELECT id FROM requester),
  (SELECT id FROM receiver),
  1, -- status 1 = accepted
  1764921736000,
  1764921736000
WHERE NOT EXISTS (
  SELECT 1 FROM friends 
  WHERE requester_id = (SELECT id FROM requester) AND receiver_id = (SELECT id FROM receiver)
);

-- Friend request 2: User 1 -> Friend User 3
WITH requester AS (
  SELECT id FROM users WHERE firebase_uid = 'piRPVX01bGc4XDDaKFXjCnfb8e12'
),
receiver AS (
  SELECT id FROM users WHERE firebase_uid = 'test-friend-uid-002'
)
INSERT OR IGNORE INTO friends (requester_id, receiver_id, status, created_at, updated_at)
SELECT 
  (SELECT id FROM requester),
  (SELECT id FROM receiver),
  0, -- status 0 = pending
  1764921737000,
  1764921737000
WHERE NOT EXISTS (
  SELECT 1 FROM friends 
  WHERE requester_id = (SELECT id FROM requester) AND receiver_id = (SELECT id FROM receiver)
);

-- Friend request 3: User 1 -> New Friend 1 (pending)
WITH requester AS (
  SELECT id FROM users WHERE firebase_uid = 'piRPVX01bGc4XDDaKFXjCnfb8e12'
),
receiver AS (
  SELECT id FROM users WHERE firebase_uid = 'test-friend-uid-003'
)
INSERT OR IGNORE INTO friends (requester_id, receiver_id, status, created_at, updated_at)
SELECT 
  (SELECT id FROM requester),
  (SELECT id FROM receiver),
  0, -- status 0 = pending
  1764921737100,
  1764921737100
WHERE NOT EXISTS (
  SELECT 1 FROM friends 
  WHERE requester_id = (SELECT id FROM requester) AND receiver_id = (SELECT id FROM receiver)
);

-- Friend request 4: New Friend 2 -> User 1 (pending)
WITH requester AS (
  SELECT id FROM users WHERE firebase_uid = 'test-friend-uid-004'
),
receiver AS (
  SELECT id FROM users WHERE firebase_uid = 'piRPVX01bGc4XDDaKFXjCnfb8e12'
)
INSERT OR IGNORE INTO friends (requester_id, receiver_id, status, created_at, updated_at)
SELECT 
  (SELECT id FROM requester),
  (SELECT id FROM receiver),
  0, -- status 0 = pending
  1764921737200,
  1764921737200
WHERE NOT EXISTS (
  SELECT 1 FROM friends 
  WHERE requester_id = (SELECT id FROM requester) AND receiver_id = (SELECT id FROM receiver)
);

-- Friend request 5: User 1 <-> New Friend 2 (accepted)
WITH requester AS (
  SELECT id FROM users WHERE firebase_uid = 'piRPVX01bGc4XDDaKFXjCnfb8e12'
),
receiver AS (
  SELECT id FROM users WHERE firebase_uid = 'test-friend-uid-004'
)
INSERT OR IGNORE INTO friends (requester_id, receiver_id, status, created_at, updated_at)
SELECT 
  (SELECT id FROM requester),
  (SELECT id FROM receiver),
  1, -- status 1 = accepted
  1764921737300,
  1764921737300
WHERE NOT EXISTS (
  SELECT 1 FROM friends 
  WHERE requester_id = (SELECT id FROM requester) AND receiver_id = (SELECT id FROM receiver)
);

-- Friend request 6: User 1 <-> New Friend 1 (accepted)
WITH requester AS (
  SELECT id FROM users WHERE firebase_uid = 'test-friend-uid-003'
),
receiver AS (
  SELECT id FROM users WHERE firebase_uid = 'piRPVX01bGc4XDDaKFXjCnfb8e12'
)
INSERT OR IGNORE INTO friends (requester_id, receiver_id, status, created_at, updated_at)
SELECT 
  (SELECT id FROM requester),
  (SELECT id FROM receiver),
  1, -- status 1 = accepted
  1764921737400,
  1764921737400
WHERE NOT EXISTS (
  SELECT 1 FROM friends 
  WHERE requester_id = (SELECT id FROM requester) AND receiver_id = (SELECT id FROM receiver)
);

-- Insert reactions
-- Friend 1 reacts to Post 3
WITH post_data AS (
  SELECT id FROM posts WHERE media_public_id = 'test/my-locket/post-3'
),
user_data AS (
  SELECT id FROM users WHERE firebase_uid = 'test-friend-uid-001'
)
INSERT OR IGNORE INTO reactions (post_id, user_id, reaction_type, created_at)
SELECT 
  (SELECT id FROM post_data),
  (SELECT id FROM user_data),
  'heart',
  1764921738000
WHERE NOT EXISTS (
  SELECT 1 FROM reactions 
  WHERE post_id = (SELECT id FROM post_data) AND user_id = (SELECT id FROM user_data)
);

-- Friend 2 reacts to Post 2
WITH post_data AS (
  SELECT id FROM posts WHERE media_public_id = 'test/my-locket/post-2'
),
user_data AS (
  SELECT id FROM users WHERE firebase_uid = 'test-friend-uid-002'
)
INSERT OR IGNORE INTO reactions (post_id, user_id, reaction_type, created_at)
SELECT 
  (SELECT id FROM post_data),
  (SELECT id FROM user_data),
  'like',
  1764921739000
WHERE NOT EXISTS (
  SELECT 1 FROM reactions 
  WHERE post_id = (SELECT id FROM post_data) AND user_id = (SELECT id FROM user_data)
);

-- Hiển thị dữ liệu đã thêm
.mode column
.headers on

SELECT '=== USERS ===' AS info;
SELECT id, firebase_uid, email, display_name, username FROM users ORDER BY id;

SELECT '=== POSTS ===' AS info;
SELECT id, user_id, media_public_id, media_url, created_at FROM posts ORDER BY created_at DESC;

SELECT '=== POST ATTRIBUTES ===' AS info;
SELECT post_id, caption, emotion, location_name FROM post_attributes ORDER BY post_id;

SELECT '=== FRIENDS ===' AS info;
SELECT f.id, u1.display_name as requester, u2.display_name as receiver, f.status, 
       CASE WHEN f.status = 0 THEN 'pending' WHEN f.status = 1 THEN 'accepted' ELSE 'rejected' END as status_name
FROM friends f
JOIN users u1 ON f.requester_id = u1.id
JOIN users u2 ON f.receiver_id = u2.id
ORDER BY f.created_at DESC;

SELECT '=== REACTIONS ===' AS info;
SELECT r.id, p.media_public_id, u.display_name as from_user, r.reaction_type FROM reactions r
JOIN posts p ON r.post_id = p.id
JOIN users u ON r.user_id = u.id
ORDER BY r.created_at DESC;
