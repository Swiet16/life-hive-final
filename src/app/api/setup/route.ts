import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/setup — checks DB connection + reports whether tables exist.
 *
 * For one-click setup, run the SQL file at:
 *   https://github.com/Swiet16/life-hive-final/blob/main/download/supabase-schema.sql
 * in your Supabase SQL Editor.
 */
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      status: "not_configured",
      message: "DATABASE_URL not set. Add it in Vercel env vars pointing to your Supabase Postgres connection string.",
      nextStep: "1. Copy DATABASE_URL from Supabase → Settings → Database → Connection string (URI)\n2. Add to Vercel env vars\n3. Run download/supabase-schema.sql in Supabase SQL Editor",
    });
  }

  try {
    const userCount = await db.user.count().catch(() => -1);
    const productCount = await db.product.count().catch(() => -1);

    if (userCount === -1 || productCount === -1) {
      return NextResponse.json({
        status: "schema_not_pushed",
        message: "DB connected but tables don't exist yet. Run the SQL setup file in Supabase SQL Editor.",
        sqlFile: "https://github.com/Swiet16/life-hive-final/blob/main/download/supabase-schema.sql",
        nextStep: "Open https://supabase.com/dashboard/project/otzqeernaaboruobnexs/sql/new → paste the SQL → Run",
      });
    }

    return NextResponse.json({
      status: "ready",
      stats: { users: userCount, products: productCount },
      adminLogin: { email: "admin@lifehive.store", password: "admin123" },
    });
  } catch (e: any) {
    return NextResponse.json({
      status: "error",
      message: e.message,
      hint: "Check that DATABASE_URL is correct and your Supabase DB is reachable.",
    });
  }
}
