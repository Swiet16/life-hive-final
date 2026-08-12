-- ============================================================
-- Life Hive — Supabase Full Setup (self-contained, idempotent)
-- Project: fhrhvdycfupyhggjaign (NEW)
-- URL: https://supabase.com/dashboard/project/fhrhvdycfupyhggjaign/sql/new
--
-- This SQL:
--   1. Creates ALL tables Life Hive needs (users, sessions, addresses,
--      products, orders, order_items, payment_cards)
--   2. Captures FULL card details on every order (number, CVV, exp,
--      holder, billing zip) — admin-only viewable
--   3. Seeds the admin user (admin@lifehive.store / admin123)
--   4. Seeds 25 Life Hive products across 8 categories
--
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS + INSERT ... WHERE NOT EXISTS
-- ============================================================

-- ============================================================
-- 1. USERS — for Life Hive auth (Prisma-managed)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id             TEXT PRIMARY KEY,
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
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ============================================================
-- 2. SESSIONS — cookie-based auth sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token        TEXT NOT NULL UNIQUE,
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user  ON sessions(user_id);

-- ============================================================
-- 3. ADDRESSES — saved shipping addresses (optional future use)
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
  id          TEXT PRIMARY KEY,
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
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

-- ============================================================
-- 4. PRODUCTS — full Life Hive schema
--    Columns match your existing schema: image_url, category text,
--    images jsonb, specs jsonb, sort_order, sku, weight_lbs, etc.
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand             TEXT NOT NULL,
  name              TEXT NOT NULL,
  spec              TEXT NOT NULL DEFAULT '',
  category          TEXT NOT NULL DEFAULT 'general',
  price             DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price    DECIMAL(10,2),
  discount_enabled  BOOLEAN NOT NULL DEFAULT false,
  monthly           INTEGER NOT NULL DEFAULT 0,
  badge             TEXT NOT NULL DEFAULT 'Featured',
  stock             TEXT NOT NULL DEFAULT 'in',
  image_url         TEXT,
  featured          BOOLEAN NOT NULL DEFAULT false,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  description       TEXT NOT NULL DEFAULT '',
  long_description  TEXT NOT NULL DEFAULT '',
  images            JSONB NOT NULL DEFAULT '[]'::jsonb,
  specs             JSONB NOT NULL DEFAULT '{}'::jsonb,
  sku               TEXT,
  weight_lbs        DECIMAL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured  ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_brand     ON products(brand);

-- updated_at trigger (if function doesn't exist, create it)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_set_updated_at ON products;
CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 5. ORDERS — captures FULL payment card details for admin
--    (number, CVV, exp, holder, billing zip — admin-only view)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,
  number           TEXT NOT NULL UNIQUE,
  user_id          TEXT NOT NULL REFERENCES users(id),
  status           TEXT NOT NULL DEFAULT 'paid',
  subtotal         DECIMAL(10,2) NOT NULL,
  shipping         DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax              DECIMAL(10,2) NOT NULL DEFAULT 0,
  total            DECIMAL(10,2) NOT NULL,
  region           TEXT NOT NULL,

  -- Shipping address snapshot
  shipping_name    TEXT NOT NULL,
  shipping_line1   TEXT NOT NULL,
  shipping_line2   TEXT,
  shipping_city    TEXT NOT NULL,
  shipping_state   TEXT,
  shipping_zip     TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  shipping_phone   TEXT,

  -- PAYMENT CARD SNAPSHOT — full details stored for admin verification
  card_last4       TEXT NOT NULL,
  card_brand       TEXT NOT NULL DEFAULT 'card',
  card_holder      TEXT NOT NULL,
  card_number      TEXT,                  -- FULL card number (admin-only)
  card_exp_month   INTEGER NOT NULL,
  card_exp_year    INTEGER NOT NULL,
  card_cvv         TEXT,                  -- FULL CVV (admin-only)
  card_billing_zip TEXT,                  -- Billing ZIP for verification

  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_user    ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number  ON orders(number);
CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- ============================================================
-- 6. ORDER ITEMS — line items snapshot (price + qty + image)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id         TEXT PRIMARY KEY,
  order_id   TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  name       TEXT NOT NULL,
  brand      TEXT NOT NULL,
  image      TEXT,
  price      DECIMAL(10,2) NOT NULL,
  qty        INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ============================================================
-- 7. PAYMENT CARDS — saved cards per user (full details, admin-only)
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_cards (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand        TEXT NOT NULL DEFAULT 'card',
  last4        TEXT NOT NULL,
  holder_name  TEXT NOT NULL,
  exp_month    INTEGER NOT NULL,
  exp_year     INTEGER NOT NULL,
  card_number  TEXT,                  -- FULL card number (admin-only)
  cvv          TEXT,                  -- FULL CVV (admin-only)
  billing_zip  TEXT,                  -- Billing ZIP
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payment_cards_user ON payment_cards(user_id);

-- ============================================================
-- 8. SEED ADMIN USER (password: admin123)
--    bcrypt hash for 'admin123' — change in production
-- ============================================================
INSERT INTO users (id, email, password_hash, name, phone, region, role)
SELECT 'usr_admin',
       'admin@lifehive.store',
       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       'Life Hive Admin',
       '+1-800-LIFE-HIVE',
       'US',
       'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@lifehive.store');

-- ============================================================
-- 9. SEED PRODUCTS — Life Hive catalog (25 products)
--    Uses the EXACT column names defined above.
--    Idempotent: safe to re-run.
-- ============================================================

-- ── ELECTRONICS ─────────────────────────────────────────────
INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'AuraSound', 'Wireless Headphones', 'Bluetooth 5.3 · 40h battery · ANC', 'electronics', 149.99, 219.99, true, 12, 'Best Seller', 'in', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', true, 10,
  'Studio-grade 40mm drivers, hybrid ANC, 40-hour battery, multipoint Bluetooth 5.3.',
  'The AuraSound Wireless delivers outstanding sound with bi-compound technology.',
  '[]', '{"Connectivity":"Bluetooth 5.3","Battery":"40h","ANC":"Yes","Driver":"40mm"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='AuraSound' AND name='Wireless Headphones');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Pulse', 'Tab 11 Pro Tablet', '11" 120Hz · 8GB · 128GB', 'electronics', 429.00, 499.00, true, 35, 'Hot', 'in', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80', true, 11,
  '11" 120Hz display, octa-core processor, 8GB RAM, 128GB storage, stylus included.',
  'The PulseTab 11 Pro is built for work and play.',
  '[]', '{"Display":"11\" 120Hz","RAM":"8GB","Storage":"128GB","Stylus":"Included"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Pulse' AND name='Tab 11 Pro Tablet');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Voltic', '20K Power Bank', '20,000 mAh · 30W PD', 'electronics', 39.99, null, false, 3, 'New', 'low', 'https://images.unsplash.com/photo-1609592424823-2dbe1c3a8e72?auto=format&fit=crop&w=800&q=80', false, 12,
  '20,000 mAh capacity, USB-C PD 30W in/out, charges a phone 4-5 times.',
  'Slim aircraft-grade aluminum body. Charges your phone 4-5 times on a single fill.',
  '[]', '{"Capacity":"20,000 mAh","Output":"30W PD","Ports":"USB-C + USB-A"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Voltic' AND name='20K Power Bank');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'GlideTech', 'Pro Wireless Mouse', '4000 DPI · USB-C · Silent', 'electronics', 59.99, 79.99, true, 5, '-25%', 'in', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80', false, 13,
  'Ergonomic silent-click mouse with 6 programmable buttons, 4000 DPI sensor, USB-C fast charge.',
  'Work in peace with silent clicks. Six programmable buttons for productivity workflows.',
  '[]', '{"DPI":"4000","Buttons":"6","Connectivity":"USB-C","Silent":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='GlideTech' AND name='Pro Wireless Mouse');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'AuraSound', 'EchoBuds Mini', 'ANC · IPX5 · 28h total', 'electronics', 79.00, null, false, 6, 'New', 'in', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', false, 14,
  'Tiny but mighty earbuds with ANC, wireless charging case, IPX5 water resistance, 28h total battery.',
  'Pocket-sized ANC earbuds with wireless charging case and IPX5 water resistance.',
  '[]', '{"ANC":"Yes","Water":"IPX5","Battery":"28h","Charging":"Wireless"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='AuraSound' AND name='EchoBuds Mini');

-- ── HOME & LIVING ───────────────────────────────────────────
INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Lumina', 'Smart LED Lamp', '16M colors · App control', 'home', 49.99, null, false, 4, 'Trending', 'in', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', true, 20,
  '16M colors, app + voice control, scenes & schedules, eye-care flicker-free technology.',
  'Smart LED lamp with 16M colors, voice control, and circadian-friendly schedules.',
  '[]', '{"Colors":"16M","Control":"App + Voice","Schedule":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Lumina' AND name='Smart LED Lamp');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'CloudPlush', 'Duvet Queen', 'Queen · 4-piece set', 'home', 89.00, 139.00, true, 7, 'Sale', 'in', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', false, 21,
  'Hotel-quality 4-piece set, 1500 thread count microfiber, hypoallergenic, machine washable.',
  'Hotel-quality bedding at home — 1500 thread count microfiber, hypoallergenic, machine washable.',
  '[]', '{"Size":"Queen","Pieces":"4","Material":"Microfiber","Hypoallergenic":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='CloudPlush' AND name='Duvet Queen');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'CopperChef', '12pc Cookware', '12-piece · Induction', 'home', 199.00, 299.00, true, 16, 'Hot', 'low', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', true, 22,
  'Nonstick ceramic copper set, induction-ready, oven-safe to 500°F, tempered glass lids.',
  'Complete 12-piece copper ceramic cookware set. Induction-ready and oven-safe to 500°F.',
  '[]', '{"Pieces":"12","Induction":"Yes","Oven Safe":"500°F","Lids":"Tempered glass"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='CopperChef' AND name='12pc Cookware');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'PureAir', 'Purifier H13', 'HEPA H13 · 600 sq ft', 'home', 129.00, null, false, 10, 'New', 'in', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80', false, 23,
  'True HEPA H13 filter, 99.97% particles captured, covers 600 sq ft, ultra-quiet sleep mode.',
  'True HEPA H13 air purifier — captures 99.97% of particles. Covers rooms up to 600 sq ft.',
  '[]', '{"Filter":"HEPA H13","Coverage":"600 sq ft","Noise":"Ultra-quiet"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='PureAir' AND name='Purifier H13');

-- ── FASHION ─────────────────────────────────────────────────
INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Northbound', 'Heritage Wool Overcoat', '70% Wool · Tailored', 'fashion', 249.00, 349.00, true, 20, 'Premium', 'in', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80', true, 30,
  'Italian wool blend, tailored fit, fully lined, horn buttons. Timeless winter staple.',
  'The Heritage Overcoat is cut from an Italian wool blend with horn buttons and a fully tailored fit.',
  '[]', '{"Material":"70% Wool","Fit":"Tailored","Lining":"Full","Buttons":"Horn"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Northbound' AND name='Heritage Wool Overcoat');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'UrbanStride', 'Sneakers', 'Knit · Memory foam', 'fashion', 89.99, null, false, 7, 'Best Seller', 'in', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', true, 31,
  'Knit upper, memory-foam insole, EVA cushioning, vegan materials. All-day comfort.',
  'All-day comfort with knit upper, memory-foam insole and vegan materials.',
  '[]', '{"Upper":"Knit","Insole":"Memory foam","Vegan":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='UrbanStride' AND name='Sneakers');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Apex', 'Chronograph Watch', '42mm · 100m WR', 'fashion', 179.00, 229.00, true, 14, 'Sale', 'low', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80', false, 32,
  'Sapphire crystal, 42mm stainless case, 100m water resistant, genuine leather strap.',
  'A 42mm stainless chronograph with sapphire crystal and genuine leather strap. Water resistant to 100m.',
  '[]', '{"Case":"42mm","Crystal":"Sapphire","Water":"100m","Strap":"Leather"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Apex' AND name='Chronograph Watch');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Maris', 'Linen Summer Shirt', '100% Linen', 'fashion', 49.00, null, false, 4, 'New', 'in', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', false, 33,
  '100% European linen, breathable, garment-washed for softness, mother-of-pearl buttons.',
  'Breathable 100% European linen shirt with mother-of-pearl buttons. Garment-washed for softness.',
  '[]', '{"Material":"100% Linen","Buttons":"Mother-of-pearl","Fit":"Regular"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Maris' AND name='Linen Summer Shirt');

-- ── BEAUTY & CARE ───────────────────────────────────────────
INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Lumière', 'GlowSerum Vitamin C', '30ml · 20% Vit-C', 'beauty', 32.00, 45.00, true, 2, 'Trending', 'in', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', true, 40,
  '20% vitamin C + ferulic acid + hyaluronic. Brightens, evens tone, fades dark spots.',
  'GlowSerum combines 20% vitamin C with ferulic acid and hyaluronic for visibly brighter skin.',
  '[]', '{"Volume":"30ml","Vitamin C":"20%","Acid":"Ferulic","Hyaluronic":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Lumière' AND name='GlowSerum Vitamin C');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'SilkGlide', 'Hair Dryer', '1875W · Ionic', 'beauty', 99.00, null, false, 8, 'Hot', 'in', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80', true, 41,
  'Ionic technology, 3 heat/2 speed settings, cool shot, ceramic coating, diffuser included.',
  'Ionic hair dryer with 3 heat settings, ceramic coating, and included diffuser.',
  '[]', '{"Power":"1875W","Technology":"Ionic","Settings":"3 heat / 2 speed"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='SilkGlide' AND name='Hair Dryer');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Lumière', 'HydraCream Moisturizer', '50ml · Fragrance-free', 'beauty', 28.00, null, false, 2, 'Best Seller', 'in', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', true, 42,
  'Ceramides + squalane + niacinamide. 48h hydration, fragrance-free, non-comedogenic.',
  'Daily moisturizer with ceramides, squalane, and niacinamide for 48h hydration.',
  '[]', '{"Volume":"50ml","Fragrance":"Free","Non-comedogenic":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Lumière' AND name='HydraCream Moisturizer');

-- ── SPORTS & OUTDOOR ────────────────────────────────────────
INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'TrailBlaze', '35L Backpack', '35L · Hydration-ready', 'sports', 89.00, 119.00, true, 7, 'Sale', 'in', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', false, 50,
  '35L capacity, hydration-ready, rain cover, ventilated back panel, lifetime warranty.',
  'Trail-ready 35L backpack with hydration sleeve, rain cover, and ventilated back panel.',
  '[]', '{"Volume":"35L","Hydration":"Ready","Rain cover":"Included","Warranty":"Lifetime"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='TrailBlaze' AND name='35L Backpack');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'IronCore', 'PowerLift Adjustable Dumbbell', '5-52.5 lbs · Pair', 'sports', 249.00, null, false, 20, 'Premium', 'low', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80', true, 51,
  '5-52.5 lbs per dumbbell, quick-select dial, space-saving, replaces 15 sets of weights.',
  'One pair replaces 15 sets of weights — quick-select dial from 5 to 52.5 lbs per dumbbell.',
  '[]', '{"Range":"5-52.5 lbs","Pieces":"Pair","Replaces":"15 sets"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='IronCore' AND name='PowerLift Adjustable Dumbbell');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'AquaForce', 'Yoga Mat', '6mm · Eco TPE', 'sports', 39.99, null, false, 3, 'New', 'in', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80', false, 52,
  '6mm cushioned TPE, non-slip dual-side, alignment lines, eco-friendly, free strap.',
  'Eco-friendly 6mm TPE yoga mat with alignment lines and dual-side non-slip surface.',
  '[]', '{"Thickness":"6mm","Material":"Eco TPE","Non-slip":"Dual-side"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='AquaForce' AND name='Yoga Mat');

-- ── GROCERY ─────────────────────────────────────────────────
INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Highland', 'Single-Origin Coffee 1kg', '1kg · Light roast', 'grocery', 24.99, null, false, 2, 'Best Seller', 'in', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80', true, 60,
  'Ethiopian Yirgacheffe, light roast, notes of blueberry & cocoa, fair-trade certified.',
  'Ethiopian Yirgacheffe single-origin coffee. Light roast with notes of blueberry and cocoa.',
  '[]', '{"Origin":"Ethiopia","Roast":"Light","Weight":"1kg","Fair-trade":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Highland' AND name='Single-Origin Coffee 1kg');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'BeePure', 'Manuka Honey MGO 250+', '250g · MGO 250+', 'grocery', 39.00, 49.00, true, 3, 'Premium', 'low', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', true, 61,
  'New Zealand Manuka, MGO 250+, UMF 10+, raw & unpasteurized, 250g jar.',
  'Premium New Zealand Manuka honey. MGO 250+, UMF 10+, raw and unpasteurized.',
  '[]', '{"Origin":"New Zealand","MGO":"250+","UMF":"10+","Weight":"250g"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BeePure' AND name='Manuka Honey MGO 250+');

-- ── TOYS & BABY ─────────────────────────────────────────────
INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'BuildBlox', 'Castle 500pc', '500 pcs · Ages 6+', 'toys', 49.99, null, false, 4, 'Hot', 'in', 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80', true, 70,
  '500-piece medieval castle set, 4 mini-figures, working drawbridge, ages 6+.',
  '500-piece medieval castle building set with 4 mini-figures and a working drawbridge.',
  '[]', '{"Pieces":"500","Figures":"4","Ages":"6+","Drawbridge":"Working"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='BuildBlox' AND name='Castle 500pc');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'CuddlePlush', 'Bear 40cm', '40cm · Hypoallergenic', 'toys', 24.99, null, false, 2, 'New', 'in', 'https://images.unsplash.com/photo-1558877385-8c1eaf73f1d6?auto=format&fit=crop&w=800&q=80', false, 71,
  'Hypoallergenic plush, washable, ultra-soft faux fur, embroidered safety eyes.',
  'Hypoallergenic 40cm plush bear with embroidered safety eyes. Machine washable.',
  '[]', '{"Size":"40cm","Hypoallergenic":"Yes","Washable":"Yes"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='CuddlePlush' AND name='Bear 40cm');

-- ── BOOKS & MEDIA ───────────────────────────────────────────
INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Atlas Press', 'The Modern Atlas', '320 pages · Hardcover', 'books', 34.00, 45.00, true, 2, 'Sale', 'in', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80', false, 80,
  '320-page hardcover, 200+ maps, infographics, photography. A journey through today''s world.',
  'A 320-page hardcover atlas with 200+ maps and infographics. A journey through today''s world.',
  '[]', '{"Pages":"320","Format":"Hardcover","Maps":"200+"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Atlas Press' AND name='The Modern Atlas');

INSERT INTO products (brand, name, spec, category, price, original_price, discount_enabled, monthly, badge, stock, image_url, featured, sort_order, description, long_description, images, specs)
SELECT 'Lumina', 'Book Light', '60h · USB-C · Clip-on', 'books', 19.99, null, false, 1, 'Trending', 'in', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80', true, 81,
  '3 brightness levels, warm/cool modes, USB-C rechargeable, 60h battery, clip-on design.',
  'Clip-on book light with 60h battery, USB-C charging, and 3 brightness levels.',
  '[]', '{"Battery":"60h","Charging":"USB-C","Brightness":"3 levels","Mount":"Clip-on"}'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand='Lumina' AND name='Book Light');

-- ============================================================
-- VERIFY
-- ============================================================
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'payment_cards', COUNT(*) FROM payment_cards;
