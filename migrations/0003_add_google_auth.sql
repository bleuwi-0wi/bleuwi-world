-- Migration 0003: Add Google OAuth columns to users
ALTER TABLE users ADD COLUMN google_id TEXT;
ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'local';
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
