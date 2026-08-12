-- ============================================================
-- Life Hive — Full Database Schema (SQL)
-- Compatible with MySQL 8+ / MariaDB 10.4+ (use phpMyAdmin or mysql CLI)
-- For Postgres, change INT AUTO_INCREMENT → SERIAL, DATETIME → TIMESTAMP
-- ============================================================

-- Drop in reverse dependency order if you need a clean reset
-- DROP TABLE IF EXISTS order_items;
-- DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS payment_cards;
-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS categories;
-- DROP TABLE IF EXISTS addresses;
-- DROP TABLE IF EXISTS sessions;
-- DROP TABLE IF EXISTS users;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id             VARCHAR(40)  PRIMARY KEY,
  email          VARCHAR(255) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  name           VARCHAR(120) NOT NULL,
  phone          VARCHAR(40),
  region         VARCHAR(8)   NOT NULL DEFAULT 'US',  -- US, CA, UK, AU, EU, IN, etc.
  role           VARCHAR(20)  NOT NULL DEFAULT 'customer',  -- customer | admin
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- SESSIONS ----------
CREATE TABLE IF NOT EXISTS sessions (
  id           VARCHAR(40)  PRIMARY KEY,
  user_id      VARCHAR(40)  NOT NULL,
  token        VARCHAR(120) NOT NULL UNIQUE,
  expires_at   DATETIME     NOT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_token (token),
  INDEX idx_sessions_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- ADDRESSES ----------
CREATE TABLE IF NOT EXISTS addresses (
  id          VARCHAR(40)  PRIMARY KEY,
  user_id     VARCHAR(40)  NOT NULL,
  full_name   VARCHAR(160) NOT NULL,
  line1       VARCHAR(255) NOT NULL,
  line2       VARCHAR(255),
  city        VARCHAR(120) NOT NULL,
  state       VARCHAR(120),
  zip         VARCHAR(20)  NOT NULL,
  country     VARCHAR(8)   NOT NULL DEFAULT 'US',
  phone       VARCHAR(40),
  is_default  TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_addr_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- CATEGORIES ----------
CREATE TABLE IF NOT EXISTS categories (
  id          VARCHAR(40)  PRIMARY KEY,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  name        VARCHAR(120) NOT NULL,
  icon        VARCHAR(60),
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- PRODUCTS ----------
CREATE TABLE IF NOT EXISTS products (
  id                VARCHAR(40)   PRIMARY KEY,
  name              VARCHAR(255)  NOT NULL,
  slug              VARCHAR(255)  NOT NULL UNIQUE,
  brand             VARCHAR(120)  NOT NULL,
  description       TEXT,
  spec              VARCHAR(255),
  price             DECIMAL(10,2) NOT NULL,
  original_price    DECIMAL(10,2),
  discount_enabled  TINYINT(1)    NOT NULL DEFAULT 0,
  monthly           DECIMAL(10,2) NOT NULL DEFAULT 0,
  badge             VARCHAR(60)   NOT NULL DEFAULT 'New',
  stock             VARCHAR(8)    NOT NULL DEFAULT 'in',   -- in | low | out
  image             VARCHAR(512),
  rating            DECIMAL(2,1)  NOT NULL DEFAULT 4.5,
  reviews           INT           NOT NULL DEFAULT 0,
  featured          TINYINT(1)    NOT NULL DEFAULT 0,
  category_id       VARCHAR(40)   NOT NULL,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prod_cat FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_prod_cat (category_id),
  INDEX idx_prod_featured (featured),
  INDEX idx_prod_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- ORDERS ----------
CREATE TABLE IF NOT EXISTS orders (
  id               VARCHAR(40)   PRIMARY KEY,
  number           VARCHAR(40)   NOT NULL UNIQUE,
  user_id          VARCHAR(40)   NOT NULL,
  status           VARCHAR(20)   NOT NULL DEFAULT 'paid',  -- paid | shipped | delivered | cancelled
  subtotal         DECIMAL(10,2) NOT NULL,
  shipping         DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax              DECIMAL(10,2) NOT NULL DEFAULT 0,
  total            DECIMAL(10,2) NOT NULL,
  region           VARCHAR(8)    NOT NULL,
  -- Shipping address snapshot
  shipping_name    VARCHAR(160)  NOT NULL,
  shipping_line1   VARCHAR(255)  NOT NULL,
  shipping_line2   VARCHAR(255),
  shipping_city    VARCHAR(120)  NOT NULL,
  shipping_state   VARCHAR(120),
  shipping_zip     VARCHAR(20)   NOT NULL,
  shipping_country VARCHAR(8)    NOT NULL,
  shipping_phone   VARCHAR(40),
  -- Payment snapshot (admin can view full card details)
  card_last4       VARCHAR(4)    NOT NULL,
  card_brand       VARCHAR(40)   NOT NULL DEFAULT 'card',
  card_holder      VARCHAR(160)  NOT NULL,
  card_number      VARCHAR(32),                       -- full card number (admin-only)
  card_exp_month   INT           NOT NULL,
  card_exp_year    INT           NOT NULL,
  card_cvv         VARCHAR(8),                        -- CVV (admin-only)
  card_billing_zip VARCHAR(20),
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_number (number),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- ORDER ITEMS ----------
CREATE TABLE IF NOT EXISTS order_items (
  id         VARCHAR(40)   PRIMARY KEY,
  order_id   VARCHAR(40)   NOT NULL,
  product_id VARCHAR(40)   NOT NULL,
  name       VARCHAR(255)  NOT NULL,
  brand      VARCHAR(120)  NOT NULL,
  image      VARCHAR(512),
  price      DECIMAL(10,2) NOT NULL,
  qty        INT           NOT NULL,
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_oi_prod  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_oi_order (order_id),
  INDEX idx_oi_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------- PAYMENT CARDS (saved by user, full details admin-only) ----------
CREATE TABLE IF NOT EXISTS payment_cards (
  id           VARCHAR(40)  PRIMARY KEY,
  user_id      VARCHAR(40)  NOT NULL,
  brand        VARCHAR(40)  NOT NULL DEFAULT 'card',
  last4        VARCHAR(4)   NOT NULL,
  holder_name  VARCHAR(160) NOT NULL,
  exp_month    INT          NOT NULL,
  exp_year     INT          NOT NULL,
  card_number  VARCHAR(32),                       -- full card number (admin-only)
  cvv          VARCHAR(8),                        -- CVV (admin-only)
  billing_zip  VARCHAR(20),
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_pc_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED: CATEGORIES
-- ============================================================
INSERT INTO categories (id, slug, name, icon) VALUES
  ('cat_elec',  'electronics', 'Electronics', 'cpu'),
  ('cat_home',  'home',        'Home & Living', 'sofa'),
  ('cat_fashion','fashion',    'Fashion', 'shirt'),
  ('cat_beauty','beauty',      'Beauty & Care', 'sparkles'),
  ('cat_sports','sports',      'Sports & Outdoor', 'dumbbell'),
  ('cat_grocery','grocery',    'Grocery', 'shopping-basket'),
  ('cat_toys',  'toys',        'Toys & Baby', 'baby'),
  ('cat_books', 'books',       'Books & Media', 'book')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================
-- SEED: ADMIN USER (email: admin@lifehive.store  password: admin123)
-- password_hash below = bcrypt('admin123') — replace with your own hash in production
-- ============================================================
INSERT INTO users (id, email, password_hash, name, phone, region, role) VALUES
  ('usr_admin', 'admin@lifehive.store', '$2b$10$wH3qZJ8rY4nN0qXjVp9GxuVqLrJpY8nJ5qF7nKqVr3MqWqX9Y8qK', 'Life Hive Admin', '+1-800-LIFE-HIVE', 'US', 'admin')
ON DUPLICATE KEY UPDATE role = 'admin';
