-- Migration 0003: Pro Analytics & Real IP Tracking
ALTER TABLE site_analytics ADD COLUMN ip_address TEXT;
ALTER TABLE site_analytics ADD COLUMN country TEXT;
ALTER TABLE site_analytics ADD COLUMN city TEXT;
ALTER TABLE site_analytics ADD COLUMN user_name TEXT;
ALTER TABLE site_analytics ADD COLUMN user_agent TEXT;

ALTER TABLE orders ADD COLUMN customer_ip TEXT;
ALTER TABLE orders ADD COLUMN country TEXT;

ALTER TABLE users ADD COLUMN last_login_ip TEXT;
ALTER TABLE users ADD COLUMN last_login_at DATETIME;
