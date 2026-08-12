# Life Hive — Everything is Here

A stylish full-stack e-commerce store built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, **Prisma**, and **shadcn/ui**. Features a unique hexagonal hive-inspired brand identity, region-aware signup, sliding cart drawer, full checkout flow with card details, and a uniquely designed admin dashboard with customer & order management.

![Life Hive](public/lifehive-logo.svg)

## Features

### Storefront
- **Hexagonal "Life Hive" logo** with honey gradient + dark onyx theme
- Hero section with floating badges and stats
- 8 product categories: Electronics, Home, Fashion, Beauty, Sports, Grocery, Toys, Books
- Featured products grid + New Arrivals
- Product detail pages with ratings, quantity selector, related products
- Sliding cart drawer with quantity controls, free-shipping progress, region-aware tax
- Search & sort on shop page

### Authentication
- Sign up with **region picker** (10 regions: US, CA, UK, AU, EU, IN, AE, SG, JP, BR)
- Each region has its own flag, currency, symbol, and tax rate
- Session-based auth via httpOnly cookies
- bcrypt password hashing

### Checkout
- Shipping address form
- **Full payment card details** (holder name, number, expiry, CVV, billing ZIP)
- Order confirmation with unique order number
- Account page showing order history

### Admin Dashboard (Unique Design)
- **Overview**: revenue/orders/customers/low-stock stat cards, revenue line chart, top categories pie chart
- **Customers**: searchable list with expandable rows showing purchase history + saved cards per customer
- **Purchase History**: sortable table with expandable rows showing items + shipping + full payment details
- **Payment Cards**: visual credit-card UI with reveal button to expose full card numbers and CVVs (admin-only)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **Database**: Prisma ORM (SQLite for local dev — switch to Postgres for production)
- **State**: Zustand (cart, auth, UI)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Geist Sans / Geist Mono

## Local Development

```bash
# Install dependencies
bun install

# Set up the database
cp .env.example .env
bun run db:push
bun run scripts/seed.ts   # seeds 25 products + admin user

# Start dev server
bun run dev
```

Open http://localhost:3000

### Default Admin Account

```
Email:    admin@lifehive.store
Password: admin123
```

## Deploying to Vercel

This project uses SQLite by default, which **does not work on Vercel** (serverless functions have no persistent filesystem). To deploy on Vercel:

### 1. Switch to Postgres

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Create a Postgres database

Use one of:
- **Vercel Postgres** (recommended — integrated): https://vercel.com/docs/storage/vercel-postgres
- **Neon** (free tier): https://neon.tech
- **Supabase** (free tier): https://supabase.com

### 3. Set environment variables in Vercel

```
DATABASE_URL=postgres://...your-connection-string...
```

### 4. Push schema & seed

After deploying, run once:

```bash
# Set DATABASE_URL to your production Postgres locally, then:
bun run db:push
bun run scripts/seed.ts
```

Or add a `/api/seed` route protected by admin auth.

### 5. Deploy

1. Push this repo to GitHub
2. Go to https://vercel.com/new
3. Import the repo
4. Vercel auto-detects Next.js — click **Deploy**
5. Add `DATABASE_URL` env var when prompted

## SQL Schema

A complete MySQL-compatible SQL schema is in [`download/lifehive.sql`](./download/lifehive.sql) — useful if you want to set up the database manually via phpMyAdmin or `mysql` CLI.

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── lifehive-logo.svg      # Hexagonal Life Hive logo
│   └── favicon.svg
├── scripts/
│   └── seed.ts                # Database seeding
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # signup, login, logout, me
│   │   │   ├── products/      # product listing
│   │   │   ├── categories/    # category listing
│   │   │   ├── orders/        # create + list orders
│   │   │   └── admin/         # stats, customers, orders, cards
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Single-page app with view router
│   │   └── globals.css        # Life Hive dark honey/onyx theme
│   ├── components/
│   │   ├── admin/             # AdminView (dashboard)
│   │   ├── auth/              # AuthDialog (signup w/ region picker)
│   │   └── site/              # Header, Footer, Hero, ProductCard, CartDrawer, etc.
│   └── lib/
│       ├── auth-store.ts      # Zustand auth state
│       ├── cart-store.ts      # Zustand cart with persist
│       ├── ui-store.ts        # Zustand view router
│       ├── regions.ts         # 10 regions with currency + tax
│       ├── session.ts         # Cookie session management
│       └── db.ts              # Prisma client
└── download/
    └── lifehive.sql           # Full MySQL-compatible SQL schema
```

## Security Note

For production:
- **Never store raw card numbers/CVs** — use Stripe, Braintree, or similar tokenization
- The current implementation stores full card details for demo purposes only
- Replace bcrypt with argon2 for stronger password hashing
- Add rate limiting on auth endpoints
- Enable CSRF protection

## License

MIT
