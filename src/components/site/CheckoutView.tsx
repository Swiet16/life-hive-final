"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useUI } from "@/lib/ui-store";
import { useAuth } from "@/lib/auth-store";
import { getRegion } from "@/lib/regions";
import {
  ArrowLeft, Lock, CreditCard, User, MapPin, CheckCircle2, ShieldCheck, Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function CheckoutView() {
  const navigate = useUI((s) => s.navigate);
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const region = getRegion(user?.region);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ number: string; total: number } | null>(null);

  // Shipping form
  const [shipping, setShipping] = useState({
    fullName: user?.name ?? "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: region.code,
    phone: user?.phone ?? "",
  });

  // Card form
  const [card, setCard] = useState({
    holderName: user?.name ?? "",
    number: "",
    expMonth: 1,
    expYear: 2027,
    cvv: "",
    billingZip: "",
  });

  const sub = subtotal();
  const tax = +(sub * region.taxRate).toFixed(2);
  const shippingFee = sub > 99 ? 0 : 9.99;
  const total = sub + tax + shippingFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id, name: i.name, brand: i.brand, image: i.image, price: i.price, qty: i.qty,
          })),
          shipping,
          card: {
            ...card,
            number: card.number.replace(/\s+/g, ""),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to place order");
        setSubmitting(false);
        return;
      }
      clear();
      setDone({ number: data.order.number, total: data.order.total });
      toast.success("Order placed!");
    } catch (e) {
      toast.error("Network error");
    }
    setSubmitting(false);
  }

  function formatCardNumber(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="size-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 grid place-items-center mx-auto mb-6">
          <CheckCircle2 className="size-10 text-emerald-400" />
        </div>
        <h1 className="font-display text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your purchase. Your order is being processed.
        </p>
        <div className="bg-card border border-border rounded-2xl p-6 mt-8 text-left">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-muted-foreground">Order Number</span>
            <span className="font-bold text-hive">{done.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Paid</span>
            <span className="font-bold">${done.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center mt-8">
          <button
            onClick={() => navigate({ name: "account" })}
            className="bg-hive text-onyx px-6 py-3 rounded-full font-bold text-sm hover-glow"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate({ name: "shop" })}
            className="border border-border px-6 py-3 rounded-full font-bold text-sm hover:bg-secondary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-2xl font-bold">Your cart is empty</p>
        <p className="text-muted-foreground mt-2">Add some products before checking out.</p>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mt-4 bg-hive text-onyx px-6 py-3 rounded-full font-bold text-sm hover-glow"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <button
        onClick={() => navigate({ name: "shop" })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" /> Continue Shopping
      </button>

      <h1 className="font-display text-3xl sm:text-4xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Left: forms */}
        <div className="space-y-8">
          {/* Shipping */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="size-8 rounded-full bg-hive/15 border border-hive/30 grid place-items-center">
                <MapPin className="size-4 text-hive" />
              </div>
              <h2 className="font-display text-lg font-bold">Shipping Address</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <CField label="Full Name" className="sm:col-span-2">
                <input required value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className="ck-input" />
              </CField>
              <CField label="Address Line 1" className="sm:col-span-2">
                <input required value={shipping.line1} onChange={(e) => setShipping({ ...shipping, line1: e.target.value })} placeholder="123 Main St" className="ck-input" />
              </CField>
              <CField label="Address Line 2 (optional)" className="sm:col-span-2">
                <input value={shipping.line2} onChange={(e) => setShipping({ ...shipping, line2: e.target.value })} placeholder="Apt, suite, etc." className="ck-input" />
              </CField>
              <CField label="City">
                <input required value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="ck-input" />
              </CField>
              <CField label="State / Province">
                <input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className="ck-input" />
              </CField>
              <CField label="ZIP / Postal Code">
                <input required value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} className="ck-input" />
              </CField>
              <CField label="Country">
                <input required value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} className="ck-input" />
              </CField>
              <CField label="Phone" className="sm:col-span-2">
                <input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="+1 555 000 0000" className="ck-input" />
              </CField>
            </div>
          </section>

          {/* Payment */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="size-8 rounded-full bg-hive/15 border border-hive/30 grid place-items-center">
                <CreditCard className="size-4 text-hive" />
              </div>
              <h2 className="font-display text-lg font-bold">Payment Details</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
              <Lock className="size-3" />
              Encrypted & secure. Your card details are stored for order processing only.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <CField label="Cardholder Name" className="sm:col-span-2">
                <input required value={card.holderName} onChange={(e) => setCard({ ...card, holderName: e.target.value })} placeholder="JANE DOE" className="ck-input uppercase" />
              </CField>
              <CField label="Card Number" className="sm:col-span-2">
                <input
                  required
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                  placeholder="4111 1111 1111 1111"
                  maxLength={23}
                  inputMode="numeric"
                  className="ck-input font-mono"
                />
              </CField>
              <CField label="Expiry Month">
                <select required value={card.expMonth} onChange={(e) => setCard({ ...card, expMonth: +e.target.value })} className="ck-input">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, "0")}</option>
                  ))}
                </select>
              </CField>
              <CField label="Expiry Year">
                <select required value={card.expYear} onChange={(e) => setCard({ ...card, expYear: +e.target.value })} className="ck-input">
                  {Array.from({ length: 12 }, (_, i) => 2024 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </CField>
              <CField label="CVV">
                <input
                  required
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  placeholder="123"
                  maxLength={4}
                  inputMode="numeric"
                  className="ck-input font-mono"
                />
              </CField>
              <CField label="Billing ZIP">
                <input
                  value={card.billingZip}
                  onChange={(e) => setCard({ ...card, billingZip: e.target.value })}
                  placeholder="12345"
                  className="ck-input"
                />
              </CField>
            </div>
          </section>
        </div>

        {/* Right: order summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3">
                  <div className="size-14 shrink-0 rounded-lg overflow-hidden bg-onyx border border-border">
                    <img src={it.image || ""} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-hive font-bold">{it.brand}</p>
                    <p className="text-sm font-semibold truncate">{it.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {it.qty}</p>
                  </div>
                  <span className="text-sm font-bold">${(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${sub.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({(region.taxRate * 100).toFixed(0)}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-400">FREE</span> : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-border pt-3">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-hive">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-hive text-onyx py-3.5 rounded-full font-bold text-sm uppercase tracking-wider mt-5 hover-glow disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <Lock className="size-4" /> Place Order
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1.5 mt-3">
              <ShieldCheck className="size-3 text-emerald-400" />
              Secured with 256-bit SSL encryption
            </p>
          </div>
        </aside>
      </form>

      <style>{`
        .ck-input {
          width: 100%;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .ck-input:focus { border-color: var(--hive); }
        .ck-input::placeholder { color: var(--muted-foreground); opacity: 0.6; }
      `}</style>
    </div>
  );
}

function CField({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}
