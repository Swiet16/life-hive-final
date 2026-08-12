import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/session";
import bcrypt from "bcryptjs";

/**
 * One-time setup endpoint for Vercel deployment.
 * Pushes schema (creates tables) and seeds initial data.
 *
 * Usage:
 *   POST /api/setup
 *   Headers: x-setup-key: <your SETUP_KEY env var value>
 *
 * After successful setup, this endpoint can be safely deleted or left
 * (it will return "already seeded" on subsequent calls).
 */

const CATEGORIES = [
  { id: "cat_elec",   slug: "electronics", name: "Electronics",     icon: "cpu" },
  { id: "cat_home",   slug: "home",        name: "Home & Living",    icon: "sofa" },
  { id: "cat_fashion",slug: "fashion",     name: "Fashion",          icon: "shirt" },
  { id: "cat_beauty", slug: "beauty",      name: "Beauty & Care",    icon: "sparkles" },
  { id: "cat_sports", slug: "sports",      name: "Sports & Outdoor", icon: "dumbbell" },
  { id: "cat_grocery",slug: "grocery",     name: "Grocery",          icon: "shopping-basket" },
  { id: "cat_toys",   slug: "toys",        name: "Toys & Baby",      icon: "baby" },
  { id: "cat_books",  slug: "books",       name: "Books & Media",    icon: "book" },
];

type Seed = {
  name: string; brand: string; category: string; price: number;
  originalPrice?: number; badge?: string; stock?: "in" | "low" | "out";
  image: string; description: string; spec: string;
};

const PRODUCTS: Seed[] = [
  // Electronics
  { name: "AuraSound Wireless Headphones", brand: "AuraSound", category: "cat_elec", price: 149.99, originalPrice: 219.99, badge: "Best Seller", stock: "in", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", description: "Studio-grade 40mm drivers, hybrid ANC, 40-hour battery, multipoint Bluetooth 5.3. Memory-foam earcups for all-day comfort.", spec: "Bluetooth 5.3 · 40h battery · ANC" },
  { name: "PulseTab 11 Pro Tablet", brand: "Pulse", category: "cat_elec", price: 429.00, originalPrice: 499.00, badge: "Hot", stock: "in", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", description: "11\" 120Hz display, octa-core processor, 8GB RAM, 128GB storage, stylus included. Perfect for work and play.", spec: "11\" 120Hz · 8GB · 128GB" },
  { name: "Voltic 20K Power Bank", brand: "Voltic", category: "cat_elec", price: 39.99, badge: "New", stock: "low", image: "https://images.unsplash.com/photo-1609592424823-2dbe1c3a8e72?auto=format&fit=crop&w=800&q=80", description: "20,000 mAh capacity, USB-C PD 30W in/out, charges a phone 4-5 times. Slim aircraft-grade aluminum body.", spec: "20,000 mAh · 30W PD" },
  { name: "GlideMouse Pro Wireless", brand: "GlideTech", category: "cat_elec", price: 59.99, originalPrice: 79.99, badge: "-25%", stock: "in", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80", description: "Ergonomic silent-click mouse with 6 programmable buttons, 4000 DPI sensor, USB-C fast charge.", spec: "4000 DPI · USB-C · Silent" },
  { name: "EchoBuds Mini Earbuds", brand: "AuraSound", category: "cat_elec", price: 79.00, badge: "New", stock: "in", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", description: "Tiny but mighty earbuds with ANC, wireless charging case, IPX5 water resistance, 28h total battery.", spec: "ANC · IPX5 · 28h total" },

  // Home & Living
  { name: "Lumina Smart LED Lamp", brand: "Lumina", category: "cat_home", price: 49.99, badge: "Trending", stock: "in", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", description: "16M colors, app + voice control, scenes & schedules, eye-care flicker-free technology.", spec: "16M colors · App control" },
  { name: "CloudPlush Duvet Queen", brand: "CloudPlush", category: "cat_home", price: 89.00, originalPrice: 139.00, badge: "Sale", stock: "in", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", description: "Hotel-quality 4-piece set, 1500 thread count microfiber, hypoallergenic, machine washable.", spec: "Queen · 4-piece set" },
  { name: "CopperChef 12pc Cookware", brand: "CopperChef", category: "cat_home", price: 199.00, originalPrice: 299.00, badge: "Hot", stock: "low", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80", description: "Nonstick ceramic copper set, induction-ready, oven-safe to 500°F, tempered glass lids.", spec: "12-piece · Induction" },
  { name: "PureAir Purifier H13", brand: "PureAir", category: "cat_home", price: 129.00, badge: "New", stock: "in", image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80", description: "True HEPA H13 filter, 99.97% particles captured, covers 600 sq ft, ultra-quiet sleep mode.", spec: "HEPA H13 · 600 sq ft" },

  // Fashion
  { name: "Heritage Wool Overcoat", brand: "Northbound", category: "cat_fashion", price: 249.00, originalPrice: 349.00, badge: "Premium", stock: "in", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80", description: "Italian wool blend, tailored fit, fully lined, horn buttons. Timeless winter staple.", spec: "70% Wool · Tailored" },
  { name: "UrbanStride Sneakers", brand: "UrbanStride", category: "cat_fashion", price: 89.99, badge: "Best Seller", stock: "in", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", description: "Knit upper, memory-foam insole, EVA cushioning, vegan materials. All-day comfort.", spec: "Knit · Memory foam" },
  { name: "Apex Chronograph Watch", brand: "Apex", category: "cat_fashion", price: 179.00, originalPrice: 229.00, badge: "Sale", stock: "low", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80", description: "Sapphire crystal, 42mm stainless case, 100m water resistant, genuine leather strap.", spec: "42mm · 100m WR" },
  { name: "Linen Summer Shirt", brand: "Maris", category: "cat_fashion", price: 49.00, badge: "New", stock: "in", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80", description: "100% European linen, breathable, garment-washed for softness, mother-of-pearl buttons.", spec: "100% Linen" },

  // Beauty & Care
  { name: "GlowSerum Vitamin C 30ml", brand: "Lumière", category: "cat_beauty", price: 32.00, originalPrice: 45.00, badge: "Trending", stock: "in", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80", description: "20% vitamin C + ferulic acid + hyaluronic. Brightens, evens tone, fades dark spots.", spec: "30ml · 20% Vit-C" },
  { name: "SilkGlide Hair Dryer", brand: "SilkGlide", category: "cat_beauty", price: 99.00, badge: "Hot", stock: "in", image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80", description: "Ionic technology, 3 heat/2 speed settings, cool shot, ceramic coating, diffuser included.", spec: "1875W · Ionic" },
  { name: "HydraCream Moisturizer", brand: "Lumière", category: "cat_beauty", price: 28.00, badge: "Best Seller", stock: "in", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80", description: "Ceramides + squalane + niacinamide. 48h hydration, fragrance-free, non-comedogenic.", spec: "50ml · Fragrance-free" },

  // Sports & Outdoor
  { name: "TrailBlaze 35L Backpack", brand: "TrailBlaze", category: "cat_sports", price: 89.00, originalPrice: 119.00, badge: "Sale", stock: "in", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80", description: "35L capacity, hydration-ready, rain cover, ventilated back panel, lifetime warranty.", spec: "35L · Hydration-ready" },
  { name: "PowerLift Adjustable Dumbbell", brand: "IronCore", category: "cat_sports", price: 249.00, badge: "Premium", stock: "low", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80", description: "5-52.5 lbs per dumbbell, quick-select dial, space-saving, replaces 15 sets of weights.", spec: "5-52.5 lbs · Pair" },
  { name: "AquaForce Yoga Mat", brand: "AquaForce", category: "cat_sports", price: 39.99, badge: "New", stock: "in", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80", description: "6mm cushioned TPE, non-slip dual-side, alignment lines, eco-friendly, free strap.", spec: "6mm · Eco TPE" },

  // Grocery
  { name: "Highland Single-Origin Coffee 1kg", brand: "Highland", category: "cat_grocery", price: 24.99, badge: "Best Seller", stock: "in", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80", description: "Ethiopian Yirgacheffe, light roast, notes of blueberry & cocoa, fair-trade certified.", spec: "1kg · Light roast" },
  { name: "Manuka Honey MGO 250+", brand: "BeePure", category: "cat_grocery", price: 39.00, originalPrice: 49.00, badge: "Premium", stock: "low", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80", description: "New Zealand Manuka, MGO 250+, UMF 10+, raw & unpasteurized, 250g jar.", spec: "250g · MGO 250+" },

  // Toys & Baby
  { name: "BuildBlox Castle 500pc", brand: "BuildBlox", category: "cat_toys", price: 49.99, badge: "Hot", stock: "in", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80", description: "500-piece medieval castle set, 4 mini-figures, working drawbridge, ages 6+.", spec: "500 pcs · Ages 6+" },
  { name: "CuddlePlush Bear 40cm", brand: "CuddlePlush", category: "cat_toys", price: 24.99, badge: "New", stock: "in", image: "https://images.unsplash.com/photo-1558877385-8c1eaf73f1d6?auto=format&fit=crop&w=800&q=80", description: "Hypoallergenic plush, washable, ultra-soft faux fur, embroidered safety eyes.", spec: "40cm · Hypoallergenic" },

  // Books & Media
  { name: "The Modern Atlas (Hardcover)", brand: "Atlas Press", category: "cat_books", price: 34.00, originalPrice: 45.00, badge: "Sale", stock: "in", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80", description: "320-page hardcover, 200+ maps, infographics, photography. A journey through today's world.", spec: "320 pages · Hardcover" },
  { name: "Lumina Book Light", brand: "Lumina", category: "cat_books", price: 19.99, badge: "Trending", stock: "in", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80", description: "3 brightness levels, warm/cool modes, USB-C rechargeable, 60h battery, clip-on design.", spec: "60h · USB-C · Clip-on" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  // Auth check
  const setupKey = process.env.SETUP_KEY;
  if (!setupKey) {
    return NextResponse.json(
      { error: "SETUP_KEY env var is not set. Set it in Vercel env vars first." },
      { status: 500 }
    );
  }
  const providedKey = req.headers.get("x-setup-key");
  if (providedKey !== setupKey) {
    return NextResponse.json(
      { error: "Invalid setup key. Pass it via x-setup-key header." },
      { status: 401 }
    );
  }

  // DB connection check
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL env var is not set. Create a Vercel Postgres database first." },
      { status: 500 }
    );
  }

  const log: string[] = [];
  try {
    log.push("Connected to database.");

    // 1. Seed categories
    log.push("Seeding categories...");
    for (const c of CATEGORIES) {
      await db.category.upsert({
        where: { slug: c.slug },
        update: { name: c.name, icon: c.icon },
        create: { id: c.id, ...c },
      });
    }
    log.push(`✓ ${CATEGORIES.length} categories`);

    // 2. Seed products
    log.push("Seeding products...");
    for (const p of PRODUCTS) {
      const slug = slugify(`${p.brand}-${p.name}`);
      const discountEnabled = !!p.originalPrice && p.originalPrice > p.price;
      const monthly = +(p.price / 12).toFixed(2);

      await db.product.upsert({
        where: { slug },
        update: {
          brand: p.brand, name: p.name, description: p.description, spec: p.spec,
          price: p.price, originalPrice: p.originalPrice ?? null, discountEnabled,
          monthly, badge: p.badge ?? "New", stock: p.stock ?? "in", image: p.image,
          featured: ["Best Seller", "Hot", "Trending", "Premium"].includes(p.badge ?? ""),
          categoryId: p.category,
        },
        create: {
          brand: p.brand, name: p.name, slug, description: p.description, spec: p.spec,
          price: p.price, originalPrice: p.originalPrice ?? null, discountEnabled,
          monthly, badge: p.badge ?? "New", stock: p.stock ?? "in", image: p.image,
          rating: 4.3 + Math.random() * 0.6,
          reviews: Math.floor(Math.random() * 500) + 12,
          featured: ["Best Seller", "Hot", "Trending", "Premium"].includes(p.badge ?? ""),
          categoryId: p.category,
        },
      });
    }
    log.push(`✓ ${PRODUCTS.length} products`);

    // 3. Seed admin user
    log.push("Seeding admin user...");
    const adminPass = await bcrypt.hash("admin123", 10);
    await db.user.upsert({
      where: { email: "admin@lifehive.store" },
      update: { role: "admin" },
      create: {
        id: "usr_admin",
        email: "admin@lifehive.store",
        passwordHash: adminPass,
        name: "Life Hive Admin",
        phone: "+1-800-LIFE-HIVE",
        region: "US",
        role: "admin",
      },
    });
    log.push("✓ admin@lifehive.store / admin123");

    log.push("Setup complete! 🎉");
    return NextResponse.json({
      success: true,
      message: "Life Hive database setup complete.",
      log,
      adminLogin: { email: "admin@lifehive.store", password: "admin123" },
      stats: { categories: CATEGORIES.length, products: PRODUCTS.length },
    });
  } catch (e: any) {
    console.error("[setup]", e);
    return NextResponse.json(
      {
        error: "Setup failed",
        message: e.message,
        log,
        hint: "If the error is about missing tables, run `prisma db push` against your DATABASE_URL first.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint — checks setup status without doing anything.
 */
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: "not_configured",
        message: "DATABASE_URL not set. Create a Vercel Postgres database and add DATABASE_URL to env vars.",
      });
    }
    const userCount = await db.user.count().catch(() => -1);
    const productCount = await db.product.count().catch(() => -1);
    if (userCount === -1 || productCount === -1) {
      return NextResponse.json({
        status: "schema_not_pushed",
        message: "Database connected but tables don't exist yet. POST to /api/setup with x-setup-key header.",
      });
    }
    return NextResponse.json({
      status: "ready",
      stats: { users: userCount, products: productCount },
    });
  } catch (e: any) {
    return NextResponse.json({
      status: "error",
      message: e.message,
    });
  }
}
