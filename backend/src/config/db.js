const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_FILE || path.join(__dirname, '..', '..', 'database.sqlite');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const rawDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Enable Foreign Keys & WAL mode for performance and concurrency
rawDb.run('PRAGMA foreign_keys = ON;');
rawDb.run('PRAGMA journal_mode = WAL;');

// Promise wrappers
const db = {
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      rawDb.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      rawDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  },
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      rawDb.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  exec: (sql) => {
    return new Promise((resolve, reject) => {
      rawDb.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

// Initialize All Database Tables
async function initDatabase() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'customer',
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image_url TEXT,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS food_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      discount_price REAL,
      is_veg INTEGER DEFAULT 1,
      is_available INTEGER DEFAULT 1,
      is_bestseller INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      image_url TEXT,
      preparation_time TEXT DEFAULT '20-25 mins',
      calories INTEGER,
      rating REAL DEFAULT 4.8,
      reviews_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customer_addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      label TEXT DEFAULT 'Home',
      recipient_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address_line TEXT NOT NULL,
      landmark TEXT,
      city TEXT DEFAULT 'Mumbai',
      postal_code TEXT,
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      description TEXT,
      discount_type TEXT NOT NULL, -- 'PERCENTAGE' or 'FLAT'
      discount_value REAL NOT NULL,
      min_order_amount REAL DEFAULT 0,
      max_discount_amount REAL,
      valid_from DATETIME,
      valid_until DATETIME,
      is_active INTEGER DEFAULT 1,
      usage_limit INTEGER DEFAULT 1000,
      times_used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      landmark TEXT,
      special_instructions TEXT,
      subtotal REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      delivery_fee REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      coupon_code TEXT,
      payment_method TEXT DEFAULT 'WHATSAPP', -- 'WHATSAPP', 'ONLINE', 'COD'
      payment_status TEXT DEFAULT 'PENDING',  -- 'PENDING', 'COMPLETED', 'FAILED'
      order_status TEXT DEFAULT 'PENDING',    -- 'PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
      whatsapp_message_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      food_item_id INTEGER REFERENCES food_items(id) ON DELETE SET NULL,
      food_name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      is_veg INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      food_item_id INTEGER REFERENCES food_items(id) ON DELETE SET NULL,
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS website_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Useful indexes
    CREATE INDEX IF NOT EXISTS idx_food_category ON food_items(category_id);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
  `;

  await db.exec(schema);
  console.log('Database tables verified and initialized.');
}

module.exports = { db, initDatabase };

