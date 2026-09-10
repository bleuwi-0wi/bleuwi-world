-- BLEUWI WORLD - Cloudflare D1 Database Schema
-- Production Ready with 2FA & Secure Password Hashing

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user', -- 'user' or 'admin'
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar TEXT,
    balance REAL NOT NULL DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT 'active', -- 'active' or 'banned'
    two_factor_enabled INTEGER NOT NULL DEFAULT 1, -- 2FA enabled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS two_factor_codes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    code TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'email',
    destination TEXT,
    attempts INTEGER NOT NULL DEFAULT 0,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    items_json TEXT NOT NULL,
    total_price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'MAD',
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Fast query indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_2fa_user ON two_factor_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_2fa_expires ON two_factor_codes(expires_at);

-- Initial Site Settings (No credentials or sensitive data)
INSERT OR IGNORE INTO site_settings (key, value) VALUES 
('banner_announcement_ar', '⚡ نعمل 24/7 مع ضمان 100% (استبدال فوري ودعم فني متواصل)'),
('banner_announcement_en', '⚡ WE WORK 24/7 WITH 100% GUARANTEE (Instant Swap & 24/7 Support)'),
('banner_announcement_fr', '⚡ SERVICE 24/7 AVEC GARANTIE OR 100% (Remplacement immédiat & support)'),
('banner_announcement_es', '⚡ SERVICIO 24/7 CON GARANTÍA DORADA 100% (Reemplazo instantáneo & soporte)'),
('whatsapp_support_phone', '212620786522'),
('maintenance_mode', 'false');
