-- ============================================================
-- Life Hive — Supabase / Postgres Schema + Seed
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Project: https://otzqeernaaboruobnexs.supabase.co
-- ============================================================

-- Drop in reverse dependency order (uncomment for clean reset)
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
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  name           TEXT NOT NULL,
  phone          TEXT,
  region         TEXT NOT NULL DEFAULT 'US',
  role           TEXT NOT NULL DEFAULT 'customer',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ---------- SESSIONS ----------
CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token        TEXT NOT NULL UNIQUE,
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- ---------- ADDRESSES ----------
CREATE TABLE IF NOT EXISTS addresses (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  line1       TEXT NOT NULL,
  line2       TEXT,
  city        TEXT NOT NULL,
  state       TEXT,
  zip         TEXT NOT NULL,
  country     TEXT NOT NULL DEFAULT 'US',
  phone       TEXT,
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addr_user ON addresses(user_id);

-- ---------- CATEGORIES ----------
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  icon        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- PRODUCTS ----------
CREATE TABLE IF NOT EXISTS products (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  brand             TEXT NOT NULL,
  description       TEXT,
  spec              TEXT,
  price             DECIMAL(10,2) NOT NULL,
  original_price    DECIMAL(10,2),
  discount_enabled  BOOLEAN NOT NULL DEFAULT false,
  monthly           DECIMAL(10,2) NOT NULL DEFAULT 0,
  badge             TEXT NOT NULL DEFAULT 'New',
  stock             TEXT NOT NULL DEFAULT 'in',
  image             TEXT,
  rating            DECIMAL(2,1) NOT NULL DEFAULT 4.5,
  reviews           INTEGER NOT NULL DEFAULT 0,
  featured          BOOLEAN NOT NULL DEFAULT false,
  category_id       TEXT NOT NULL REFERENCES categories(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_prod_cat ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_prod_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_prod_slug ON products(slug);

-- ---------- ORDERS ----------
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  number           TEXT NOT NULL UNIQUE,
  user_id          TEXT NOT NULL REFERENCES users(id),
  status           TEXT NOT NULL DEFAULT 'paid',
  subtotal         DECIMAL(10,2) NOT NULL,
  shipping         DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax              DECIMAL(10,2) NOT NULL DEFAULT 0,
  total            DECIMAL(10,2) NOT NULL,
  region           TEXT NOT NULL,
  shipping_name    TEXT NOT NULL,
  shipping_line1   TEXT NOT NULL,
  shipping_line2   TEXT,
  shipping_city    TEXT NOT NULL,
  shipping_state   TEXT,
  shipping_zip     TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  shipping_phone   TEXT,
  card_last4       TEXT NOT NULL,
  card_brand       TEXT NOT NULL DEFAULT 'card',
  card_holder      TEXT NOT NULL,
  card_number      TEXT,
  card_exp_month   INTEGER NOT NULL,
  card_exp_year    INTEGER NOT NULL,
  card_cvv         TEXT,
  card_billing_zip TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- ---------- ORDER ITEMS ----------
CREATE TABLE IF NOT EXISTS order_items (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id   TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  name       TEXT NOT NULL,
  brand      TEXT NOT NULL,
  image      TEXT,
  price      DECIMAL(10,2) NOT NULL,
  qty        INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_oi_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_oi_product ON order_items(product_id);

-- ---------- PAYMENT CARDS ----------
CREATE TABLE IF NOT EXISTS payment_cards (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand        TEXT NOT NULL DEFAULT 'card',
  last4        TEXT NOT NULL,
  holder_name  TEXT NOT NULL,
  exp_month    INTEGER NOT NULL,
  exp_year     INTEGER NOT NULL,
  card_number  TEXT,
  cvv          TEXT,
  billing_zip  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pc_user ON payment_cards(user_id);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Categories
INSERT INTO categories (id, slug, name, icon) VALUES
  ('cat_elec',   'electronics', 'Electronics',     'cpu'),
  ('cat_home',   'home',        'Home & Living',    'sofa'),
  ('cat_fashion','fashion',     'Fashion',          'shirt'),
  ('cat_beauty', 'beauty',      'Beauty & Care',    'sparkles'),
  ('cat_sports', 'sports',      'Sports & Outdoor', 'dumbbell'),
  ('cat_grocery','grocery',     'Grocery',          'shopping-basket'),
  ('cat_toys',   'toys',        'Toys & Baby',      'baby'),
  ('cat_books',  'books',       'Books & Media',    'book')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

-- Admin user (password: admin123 — bcrypt hash below)
-- NOTE: This bcrypt hash is for 'admin123' — change it in production
INSERT INTO users (id, email, password_hash, name, phone, region, role) VALUES
  ('usr_admin', 'admin@lifehive.store', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Life Hive Admin', '+1-800-LIFE-HIVE', 'US', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Products
INSERT INTO products (name, slug, brand, description, spec, price, original_price, discount_enabled, monthly, badge, stock, image, rating, reviews, featured, category_id) VALUES
  ('AuraSound Wireless Headphones', 'aurasound-aurasound-wireless-headphones', 'AuraSound', 'Studio-grade 40mm drivers, hybrid ANC, 40-hour battery, multipoint Bluetooth 5.3.', 'Bluetooth 5.3 · 40h battery · ANC', 149.99, 219.99, true, 12.50, 'Best Seller', 'in', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 4.6, 234, true, 'cat_elec'),
  ('PulseTab 11 Pro Tablet', 'pulse-pulsetab-11-pro-tablet', 'Pulse', '11" 120Hz display, octa-core processor, 8GB RAM, 128GB storage, stylus included.', '11" 120Hz · 8GB · 128GB', 429.00, 499.00, true, 35.75, 'Hot', 'in', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80', 4.5, 156, true, 'cat_elec'),
  ('Voltic 20K Power Bank', 'voltic-voltic-20k-power-bank', 'Voltic', '20,000 mAh capacity, USB-C PD 30W in/out, charges a phone 4-5 times.', '20,000 mAh · 30W PD', 39.99, null, false, 3.33, 'New', 'low', 'https://images.unsplash.com/photo-1609592424823-2dbe1c3a8e72?auto=format&fit=crop&w=800&q=80', 4.4, 87, false, 'cat_elec'),
  ('GlideMouse Pro Wireless', 'glidetech-glidemouse-pro-wireless', 'GlideTech', 'Ergonomic silent-click mouse with 6 programmable buttons, 4000 DPI sensor.', '4000 DPI · USB-C · Silent', 59.99, 79.99, true, 5.00, '-25%', 'in', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', 4.5, 112, false, 'cat_elec'),
  ('EchoBuds Mini Earbuds', 'aurasound-echobuds-mini-earbuds', 'AuraSound', 'Tiny earbuds with ANC, wireless charging case, IPX5 water resistance, 28h battery.', 'ANC · IPX5 · 28h total', 79.00, null, false, 6.58, 'New', 'in', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', 4.4, 65, false, 'cat_elec'),
  ('Lumina Smart LED Lamp', 'lumina-lumina-smart-led-lamp', 'Lumina', '16M colors, app + voice control, scenes & schedules, eye-care flicker-free.', '16M colors · App control', 49.99, null, false, 4.17, 'Trending', 'in', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', 4.4, 98, true, 'cat_home'),
  ('CloudPlush Duvet Queen', 'cloudplush-cloudplush-duvet-queen', 'CloudPlush', 'Hotel-quality 4-piece set, 1500 thread count microfiber, hypoallergenic.', 'Queen · 4-piece set', 89.00, 139.00, true, 7.42, 'Sale', 'in', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 4.6, 187, false, 'cat_home'),
  ('CopperChef 12pc Cookware', 'copperchef-copperchef-12pc-cookware', 'CopperChef', 'Nonstick ceramic copper set, induction-ready, oven-safe to 500°F.', '12-piece · Induction', 199.00, 299.00, true, 16.58, 'Hot', 'low', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', 4.7, 134, true, 'cat_home'),
  ('PureAir Purifier H13', 'pureair-pureair-purifier-h13', 'PureAir', 'True HEPA H13 filter, 99.97% particles captured, covers 600 sq ft.', 'HEPA H13 · 600 sq ft', 129.00, null, false, 10.75, 'New', 'in', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80', 4.5, 76, false, 'cat_home'),
  ('Heritage Wool Overcoat', 'northbound-heritage-wool-overcoat', 'Northbound', 'Italian wool blend, tailored fit, fully lined, horn buttons.', '70% Wool · Tailored', 249.00, 349.00, true, 20.75, 'Premium', 'in', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', 4.6, 89, true, 'cat_fashion'),
  ('UrbanStride Sneakers', 'urbanstride-urbanstride-sneakers', 'UrbanStride', 'Knit upper, memory-foam insole, EVA cushioning, vegan materials.', 'Knit · Memory foam', 89.99, null, false, 7.50, 'Best Seller', 'in', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', 4.4, 245, true, 'cat_fashion'),
  ('Apex Chronograph Watch', 'apex-apex-chronograph-watch', 'Apex', 'Sapphire crystal, 42mm stainless case, 100m water resistant.', '42mm · 100m WR', 179.00, 229.00, true, 14.92, 'Sale', 'low', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80', 4.7, 156, false, 'cat_fashion'),
  ('Linen Summer Shirt', 'maris-linen-summer-shirt', 'Maris', '100% European linen, breathable, garment-washed for softness.', '100% Linen', 49.00, null, false, 4.08, 'New', 'in', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', 4.5, 67, false, 'cat_fashion'),
  ('GlowSerum Vitamin C 30ml', 'lumiere-glowserum-vitamin-c-30ml', 'Lumière', '20% vitamin C + ferulic acid + hyaluronic. Brightens, evens tone.', '30ml · 20% Vit-C', 32.00, 45.00, true, 2.67, 'Trending', 'in', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', 4.4, 198, true, 'cat_beauty'),
  ('SilkGlide Hair Dryer', 'silkglide-silkglide-hair-dryer', 'SilkGlide', 'Ionic technology, 3 heat/2 speed settings, cool shot, ceramic coating.', '1875W · Ionic', 99.00, null, false, 8.25, 'Hot', 'in', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80', 4.4, 87, true, 'cat_beauty'),
  ('HydraCream Moisturizer', 'lumiere-hydracream-moisturizer', 'Lumière', 'Ceramides + squalane + niacinamide. 48h hydration, fragrance-free.', '50ml · Fragrance-free', 28.00, null, false, 2.33, 'Best Seller', 'in', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', 4.9, 312, true, 'cat_beauty'),
  ('TrailBlaze 35L Backpack', 'trailblaze-trailblaze-35l-backpack', 'TrailBlaze', '35L capacity, hydration-ready, rain cover, ventilated back panel.', '35L · Hydration-ready', 89.00, 119.00, true, 7.42, 'Sale', 'in', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', 4.5, 98, false, 'cat_sports'),
  ('PowerLift Adjustable Dumbbell', 'ironcore-powerlift-adjustable-dumbbell', 'IronCore', '5-52.5 lbs per dumbbell, quick-select dial, replaces 15 sets of weights.', '5-52.5 lbs · Pair', 249.00, null, false, 20.75, 'Premium', 'low', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', 4.8, 76, true, 'cat_sports'),
  ('AquaForce Yoga Mat', 'aquaforce-aquaforce-yoga-mat', 'AquaForce', '6mm cushioned TPE, non-slip dual-side, alignment lines, eco-friendly.', '6mm · Eco TPE', 39.99, null, false, 3.33, 'New', 'in', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80', 4.5, 134, false, 'cat_sports'),
  ('Highland Single-Origin Coffee 1kg', 'highland-highland-single-origin-coffee-1kg', 'Highland', 'Ethiopian Yirgacheffe, light roast, notes of blueberry & cocoa, fair-trade.', '1kg · Light roast', 24.99, null, false, 2.08, 'Best Seller', 'in', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80', 4.4, 287, true, 'cat_grocery'),
  ('Manuka Honey MGO 250+', 'beepure-manuka-honey-mgo-250', 'BeePure', 'New Zealand Manuka, MGO 250+, UMF 10+, raw & unpasteurized, 250g jar.', '250g · MGO 250+', 39.00, 49.00, true, 3.25, 'Premium', 'low', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', 4.9, 156, true, 'cat_grocery'),
  ('BuildBlox Castle 500pc', 'buildblox-buildblox-castle-500pc', 'BuildBlox', '500-piece medieval castle set, 4 mini-figures, working drawbridge, ages 6+.', '500 pcs · Ages 6+', 49.99, null, false, 4.17, 'Hot', 'in', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80', 4.5, 89, true, 'cat_toys'),
  ('CuddlePlush Bear 40cm', 'cuddleplush-cuddleplush-bear-40cm', 'CuddlePlush', 'Hypoallergenic plush, washable, ultra-soft faux fur, embroidered safety eyes.', '40cm · Hypoallergenic', 24.99, null, false, 2.08, 'New', 'in', 'https://images.unsplash.com/photo-1558877385-8c1eaf73f1d6?auto=format&fit=crop&w=800&q=80', 4.5, 67, false, 'cat_toys'),
  ('The Modern Atlas (Hardcover)', 'atlas-press-the-modern-atlas-hardcover', 'Atlas Press', '320-page hardcover, 200+ maps, infographics, photography.', '320 pages · Hardcover', 34.00, 45.00, true, 2.83, 'Sale', 'in', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80', 4.6, 78, false, 'cat_books'),
  ('Lumina Book Light', 'lumina-lumina-book-light', 'Lumina', '3 brightness levels, warm/cool modes, USB-C rechargeable, 60h battery, clip-on.', '60h · USB-C · Clip-on', 19.99, null, false, 1.67, 'Trending', 'in', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80', 4.5, 145, true, 'cat_books')
ON CONFLICT (slug) DO NOTHING;

-- Verify
SELECT 'users' AS table_name, COUNT(*) AS count FROM users
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'products', COUNT(*) FROM products;
