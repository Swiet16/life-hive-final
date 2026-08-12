import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const q = url.searchParams.get("q");
  const featured = url.searchParams.get("featured");

  const where: any = {};
  if (category && category !== "all") {
    where.category = { slug: category };
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { brand: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (featured === "1") where.featured = true;

  const products = await db.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 200,
  });

  return NextResponse.json({ products });
}
