-- Migration 0005: Create reviews table for persistent client reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  comment TEXT NOT NULL,
  date TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 1,
  likes INTEGER NOT NULL DEFAULT 0,
  replies_json TEXT DEFAULT '[]',
  ip TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);

-- Seed initial real review
INSERT OR IGNORE INTO reviews (id, name, service, rating, comment, date, verified, likes, replies_json, status)
VALUES (
  'rev_seed_1',
  'Sami_Gamer',
  'Video Editing',
  5,
  'Fast delivery, amazing video montage quality! 100% recommended.',
  'Sep 2, 2026',
  1,
  2,
  '[{"id": 1725257100000, "author": "BLEUWI", "text": "Thanks for your trust brother! Always at your service 🔥", "isCreator": true, "date": "Sep 2"}]',
  'approved'
);
