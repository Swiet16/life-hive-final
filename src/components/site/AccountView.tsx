"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { useUI } from "@/lib/ui-store";
import { Package, MapPin, CreditCard, ArrowRight, ChevronRight } from "lucide-react";
import { getRegion } from "@/lib/regions";

type OrderItem = {
  id: string;
  name: string;
  brand: string;
  image: string | null;
  price: number;
  qty: number;
};

type Order = {
  id: string;
  number: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  region: string;
  createdAt: string;
  items: OrderItem[];
};

export function AccountView() {
  const { user, logout } = useAuth();
  const navigate = useUI((s) => s.navigate);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-2xl font-bold">Please sign in</p>
        <p className="text-muted-foreground mt-2">You need to be signed in to view your orders.</p>
      </div>
    );
  }

  const region = getRegion(user.region);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-hive/15 border border-hive/30 grid place-items-center text-hive font-bold text-2xl">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-hive font-bold">Life Hive Member</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <button
          onClick={async () => { await logout(); navigate({ name: "home" }); }}
          className="border border-border px-4 py-2 rounded-full text-xs font-semibold hover:bg-secondary transition-colors self-start"
        >
          Sign out
        </button>
      </div>

      {/* Account info */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <InfoCard icon={<MapPin className="size-4" />} label="Region" value={`${region.flag} ${region.label}`} />
        <InfoCard icon={<CreditCard className="size-4" />} label="Currency" value={region.currency} />
        <InfoCard icon={<Package className="size-4" />} label="Total Orders" value={String(orders.length)} />
      </div>

      {/* Orders */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold mb-5">Order History</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-secondary/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="size-16 rounded-full bg-hive/10 border border-hive/30 grid place-items-center mx-auto mb-3">
              <Package className="size-7 text-hive/60" />
            </div>
            <p className="font-semibold">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              When you place your first order, it'll appear here.
            </p>
            <button
              onClick={() => navigate({ name: "shop" })}
              className="mt-4 bg-hive text-onyx px-5 py-2.5 rounded-full font-bold text-sm hover-glow inline-flex items-center gap-2"
            >
              Start Shopping <ArrowRight className="size-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
      <div className="size-9 rounded-full bg-hive/10 border border-hive/30 grid place-items-center text-hive">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const statusColors: Record<string, string> = {
    paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    shipped: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    delivered: "bg-hive/15 text-hive border-hive/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-secondary/40 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-lg bg-hive/10 border border-hive/30 grid place-items-center">
            <Package className="size-5 text-hive" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">{order.number}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: "numeric", month: "short", day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColors[order.status] ?? statusColors.paid}`}>
            {order.status}
          </span>
          <span className="font-bold text-hive">${order.total.toFixed(2)}</span>
          <ChevronRight className={`size-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border p-4 bg-background/40">
          <div className="space-y-3">
            {order.items.map((it) => (
              <div key={it.id} className="flex gap-3 items-center">
                <div className="size-12 shrink-0 rounded-lg overflow-hidden bg-onyx border border-border">
                  <img src={it.image || ""} alt={it.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-hive font-bold">{it.brand}</p>
                  <p className="text-sm font-semibold truncate">{it.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {it.qty} · ${it.price.toFixed(2)}</p>
                </div>
                <span className="text-sm font-bold">${(it.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
