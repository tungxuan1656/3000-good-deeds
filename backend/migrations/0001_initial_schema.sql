-- Drop existing tables if they exist (Clean slate for 3000 Good Deeds)
DROP TABLE IF EXISTS posts_tags;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS friends;
DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS achievement_definitions;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS good_deeds;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firebase_uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at INTEGER NOT NULL, -- Unix timestamp
  updated_at INTEGER NOT NULL
);

-- Categories Table (Types of Good Deeds)
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name or emoji
  color TEXT, -- Hex code
  is_active BOOLEAN DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Good Deeds Table (Core Feature)
CREATE TABLE good_deeds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  description TEXT, -- Optional note
  performed_at INTEGER NOT NULL, -- Unix timestamp when deed was done
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Goals Table
CREATE TABLE goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  target_count INTEGER NOT NULL,
  start_date INTEGER NOT NULL,
  end_date INTEGER, -- Optional
  status TEXT DEFAULT 'active', -- active, completed, archived
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Achievement Definitions
CREATE TABLE achievement_definitions (
  id TEXT PRIMARY KEY, -- e.g., 'first_deed', '7_day_streak'
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria_type TEXT NOT NULL, -- 'count', 'streak'
  criteria_value INTEGER NOT NULL,
  icon TEXT
);

-- User Achievements
CREATE TABLE user_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  achievement_id TEXT NOT NULL,
  earned_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievement_definitions(id)
);

-- Initial Seed Data for Categories
INSERT INTO categories (name, description, icon, color) VALUES 
('Giúp đỡ người khó khăn', 'Chia sẻ vật chất hoặc tinh thần', 'HandHeart', '#FF6B6B'),
('Bảo vệ môi trường', 'Nhặt rác, trồng cây, tiết kiệm điện', 'Leaf', '#4ECDC4'),
('Lời nói thiện lành', 'Nói lời động viên, hòa giải', 'MessageCircleHeart', '#FFE66D'),
('Hiếu thảo', 'Chăm sóc ông bà, cha mẹ', 'Home', '#FF9F43'),
('Phóng sinh / Ăn chay', 'Bảo vệ sự sống', 'Bird', '#1DD1A1'),
('Khác', 'Các việc thiện khác', 'Star', '#A29BFE');

-- Initial Seed for Achievements
INSERT INTO achievement_definitions (id, name, description, criteria_type, criteria_value, icon) VALUES
('first_deed', 'Khởi đầu thiện lành', 'Ghi nhận việc thiện đầu tiên', 'count', 1, 'Sprout'),
('streak_3', 'Tam nhật tu', '3 ngày liên tiếp làm việc thiện', 'streak', 3, 'Flame'),
('streak_7', 'Thất nhật tinh tấn', '7 ngày liên tiếp làm việc thiện', 'streak', 7, 'Zap'),
('count_100', 'Bách thiện', 'Đạt mốc 100 việc thiện', 'count', 100, 'Medal');
