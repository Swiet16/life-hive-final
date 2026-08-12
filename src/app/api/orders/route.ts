import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { getRegion } from "@/lib/regions";

const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  image: z.string().optional().nullable(),
  price: z.number(),
  qty: z.number().int().min(1),
});

const OrderSchema = z.object({
  items: z.array(ItemSchema).min(1, "Cart is empty"),
  shipping: z.object({
    fullName: z.string().min(2),
    line1: z.string().min(3),
    line2: z.string().optional().nullable(),
    city: z.string().min(1),
    state: z.string().optional().nullable(),
    zip: z.string().min(1),
    country: z.string().min(2),
    phone: z.string().optional().nullable(),
  }),
  card: z.object({
    holderName: z.string().min(2),
    number: z.string().min(12).max(23),
    expMonth: z.number().int().min(1).max(12),
    expYear: z.number().int().min(2024).max(2099),
    cvv: z.string().min(3).max(4),
    billingZip: z.string().optional().nullable(),
  }),
});

function detectBrand(num: string): string {
  const n = num.replace(/\s+/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^6(?:011|5)/.test(n)) return "discover";
  return "card";
}

function orderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  const rnd = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `LH-${ts}-${rnd}`;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to place an order" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = OrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid order data" },
        { status: 400 }
      );
    }

    const { items, shipping, card } = parsed.data;

    // Verify products exist & compute subtotal from DB (trust server prices)
    const productIds = items.map((i) => i.id);
    const dbProducts = await db.product.findMany({ where: { id: { in: productIds } } });
    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: "One or more products unavailable" }, { status: 400 });
    }
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));
    const subtotal = items.reduce(
      (sum, it) => sum + (productMap.get(it.id)?.price ?? it.price) * it.qty,
      0
    );
    const region = getRegion(user.region);
    const tax = +(subtotal * region.taxRate).toFixed(2);
    const shippingFee = subtotal > 99 ? 0 : 9.99;
    const total = +(subtotal + tax + shippingFee).toFixed(2);

    const last4 = card.number.replace(/\s+/g, "").slice(-4);
    const brand = detectBrand(card.number);
    const fullNumber = card.number.replace(/\s+/g, "");

    const order = await db.order.create({
      data: {
        number: orderNumber(),
        userId: user.id,
        status: "paid",
        subtotal,
        shipping: shippingFee,
        tax,
        total,
        region: user.region,
        shippingName: shipping.fullName,
        shippingLine1: shipping.line1,
        shippingLine2: shipping.line2 ?? null,
        shippingCity: shipping.city,
        shippingState: shipping.state ?? null,
        shippingZip: shipping.zip,
        shippingCountry: shipping.country,
        shippingPhone: shipping.phone ?? null,
        cardLast4: last4,
        cardBrand: brand,
        cardHolder: card.holderName,
        cardNumber: fullNumber,
        cardExpMonth: card.expMonth,
        cardExpYear: card.expYear,
        cardCvv: card.cvv,
        cardBillingZip: card.billingZip ?? null,
        items: {
          create: items.map((it) => ({
            productId: it.id,
            name: it.name,
            brand: it.brand,
            image: it.image ?? "",
            price: productMap.get(it.id)?.price ?? it.price,
            qty: it.qty,
          })),
        },
      },
      include: { items: true },
    });

    // Save card for reuse
    await db.paymentCard.create({
      data: {
        userId: user.id,
        brand,
        last4,
        holderName: card.holderName,
        expMonth: card.expMonth,
        expYear: card.expYear,
        cardNumber: fullNumber,
        cvv: card.cvv,
        billingZip: card.billingZip ?? null,
      },
    });

    return NextResponse.json({ order });
  } catch (e) {
    console.error("[orders POST]", e);
    return NextResponse.json({ error: "Server error placing order" }, { status: 500 });
  }
}
