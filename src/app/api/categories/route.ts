import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Returns distinct categories from the products table (no separate categories table).
export async function GET() {
  const rows = await db.product.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });

  // Provide friendly display labels + icons for known categories.
  const META: Record<string, { label: string; icon: string }> = {
    electronics: { label: "Electronics",      icon: "cpu" },
    home:        { label: "Home & Living",     icon: "sofa" },
    fashion:     { label: "Fashion",           icon: "shirt" },
    beauty:      { label: "Beauty & Care",     icon: "sparkles" },
    sports:      { label: "Sports & Outdoor",  icon: "dumbbell" },
    grocery:     { label: "Grocery",           icon: "shopping-basket" },
    toys:        { label: "Toys & Baby",       icon: "baby" },
    books:       { label: "Books & Media",     icon: "book" },
    tires:       { label: "Tires",             icon: "circle-dot" },
    wheels:      { label: "Wheels & Rims",     icon: "circle" },
    seats:       { label: "Seats",             icon: "armchair" },
    accessories: { label: "Accessories",       icon: "package" },
    "lift-kits": { label: "Lift Kits",         icon: "wrench" },
    brakes:      { label: "Brakes",            icon: "disc" },
  };

  const categories = rows.map((r, i) => ({
    id: r.category,
    slug: r.category,
    name: META[r.category]?.label ?? r.category.charAt(0).toUpperCase() + r.category.slice(1),
    icon: META[r.category]?.icon ?? "tag",
  }));

  return NextResponse.json({ categories });
}
