-- BLEUWI WORLD: Migration 0004 - Order Done Timestamps & Turnaround Tracking
-- Adds completion timestamp, duration in minutes, admin notes, and operator username

ALTER TABLE orders ADD COLUMN completed_at DATETIME;
ALTER TABLE orders ADD COLUMN time_to_complete_minutes INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN fulfillment_notes TEXT;
ALTER TABLE orders ADD COLUMN completed_by TEXT;
