import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const customers = await db.user.findMany({
    where: { role: "customer" },
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          number: true,
          total: true,
          status: true,
          createdAt: true,
          items: { take: 5, select: { name: true, brand: true, image: true, qty: true, price: true } },
        },
      },
      cards: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          brand: true,
          last4: true,
          holderName: true,
          expMonth: true,
          expYear: true,
          cardNumber: true,
          cvv: true,
          billingZip: true,
          createdAt: true,
        },
      },
      _count: { select: { orders: true } },
    },
  });

  return NextResponse.json({
    customers: customers.map((c) => ({
      id: c.id,
      email: c.email,
      name: c.name,
      phone: c.phone,
      region: c.region,
      createdAt: c.createdAt,
      totalOrders: c._count.orders,
      totalSpent: c.orders.reduce((s, o) => s + o.total, 0),
      orders: c.orders,
      cards: c.cards,
    })),
  });
}
