-- Migration: 0002_admin_totp_setup.sql
-- Add Google Authenticator (TOTP) two-factor authentication columns for Admin users

ALTER TABLE users ADD COLUMN two_factor_secret TEXT;
ALTER TABLE users ADD COLUMN two_factor_confirmed_at DATETIME;
ALTER TABLE users ADD COLUMN two_factor_failed_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN two_factor_locked_until DATETIME;
ALTER TABLE users ADD COLUMN two_factor_backup_codes TEXT;
