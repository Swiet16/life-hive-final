import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [totalCustomers, totalOrders, totalRevenueAgg, totalProducts, lowStock] = await Promise.all([
    db.user.count({ where: { role: "customer" } }),
    db.order.count(),
    db.order.aggregate({ _sum: { total: true } }),
    db.product.count(),
    db.product.count({ where: { stock: "low" } }),
  ]);

  // Revenue last 7 days
  const sevenAgo = new Date();
  sevenAgo.setDate(sevenAgo.getDate() - 6);
  sevenAgo.setHours(0, 0, 0, 0);
  const recentOrders = await db.order.findMany({
    where: { createdAt: { gte: sevenAgo } },
    select: { total: true, createdAt: true },
  });

  const dayMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const o of recentOrders) {
    const k = o.createdAt.toISOString().slice(0, 10);
    dayMap.set(k, (dayMap.get(k) ?? 0) + o.total);
  }
  const revenueSeries = Array.from(dayMap.entries()).map(([date, value]) => ({ date, value }));

  // Top categories
  const orders = await db.order.findMany({
    include: { items: { include: { product: { include: { category: true } } } } },
  });
  const catMap = new Map<string, number>();
  for (const o of orders) {
    for (const it of o.items) {
      const catName = it.product?.category?.name ?? "Other";
      catMap.set(catName, (catMap.get(catName) ?? 0) + it.price * it.qty);
    }
  }
  const topCategories = Array.from(catMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return NextResponse.json({
    totalCustomers,
    totalOrders,
    totalRevenue: totalRevenueAgg._sum.total ?? 0,
    totalProducts,
    lowStock,
    revenueSeries,
    topCategories,
  });
}
