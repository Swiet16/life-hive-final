"use client";

import { useEffect, useState } from "react";
import {
  Users, ShoppingCart, DollarSign, Package, TrendingUp, CreditCard, Search,
  Eye, ChevronDown, ChevronRight, ShieldCheck, AlertTriangle,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useUI } from "@/lib/ui-store";

type Stats = {
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStock: number;
  revenueSeries: { date: string; value: number }[];
  topCategories: { name: string; value: number }[];
};

type Customer = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  region: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  orders: any[];
  cards: any[];
};

type AdminOrder = {
  id: string;
  number: string;
  status: string;
  total: number;
  createdAt: string;
  region: string;
  cardLast4: string;
  cardBrand: string;
  cardHolder: string;
  cardNumber: string | null;
  cardExpMonth: number;
  cardExpYear: number;
  cardCvv: string | null;
  cardBillingZip: string | null;
  shippingName: string;
  shippingCity: string;
  shippingCountry: string;
  user: { id: string; name: string; email: string; region: string };
  items: any[];
};

const PIE_COLORS = ["#f59e0b", "#10b981", "#8b5cf6", "#06b6d4", "#ef4444", "#fbbf24", "#a78bfa"];

export function AdminView() {
  const navigate = useUI((s) => s.navigate);
  const [stats, setStats] = useState<Stats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "customers" | "orders" | "cards">("overview");
  const [search, setSearch] = useState("");
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/customers").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ])
      .then(([s, c, o]) => {
        setStats(s);
        setCustomers(c.customers ?? []);
        setOrders(o.orders ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function toggleReveal(id: string) {
    setRevealedCards((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.user.name.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Collect all cards across customers (admin card view)
  const allCards = customers.flatMap((c) =>
    c.cards.map((card) => ({ ...card, customer: c }))
  );
  const filteredCards = allCards.filter(
    (c) =>
      c.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      c.customer.email.toLowerCase().includes(search.toLowerCase()) ||
      c.last4.includes(search)
  );

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="size-12 rounded-full border-2 border-hive border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading admin console…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-onyx">
      {/* Admin Top Bar */}
      <div className="border-b border-border bg-card/40 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-hive/15 border border-hive/40 grid place-items-center">
              <ShieldCheck className="size-4 text-hive" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-hive font-bold leading-none">Life Hive</p>
              <p className="font-display font-bold leading-tight">Admin Console</p>
            </div>
          </div>
          <button
            onClick={() => navigate({ name: "home" })}
            className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-secondary transition-colors"
          >
            ← Back to Store
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "customers", label: "Customers", icon: Users },
            { id: "orders", label: "Purchase History", icon: ShoppingCart },
            { id: "cards", label: "Payment Cards", icon: CreditCard },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? "border-hive text-hive"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && stats && (
          <div className="space-y-6 animate-fade-in">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<DollarSign className="size-5" />}
                label="Total Revenue"
                value={`$${stats.totalRevenue.toFixed(2)}`}
                trend="+12.4%"
                color="hive"
              />
              <StatCard
                icon={<ShoppingCart className="size-5" />}
                label="Total Orders"
                value={String(stats.totalOrders)}
                trend="+8.1%"
                color="emerald"
              />
              <StatCard
                icon={<Users className="size-5" />}
                label="Customers"
                value={String(stats.totalCustomers)}
                trend="+15.7%"
                color="purple"
              />
              <StatCard
                icon={<Package className="size-5" />}
                label="Low Stock"
                value={String(stats.lowStock)}
                trend={`${stats.totalProducts} total`}
                color="amber"
              />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Revenue line chart */}
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold">Revenue (last 7 days)</h3>
                    <p className="text-xs text-muted-foreground">Daily order totals</p>
                  </div>
                  <div className="size-9 rounded-full bg-hive/10 border border-hive/30 grid place-items-center">
                    <DollarSign className="size-4 text-hive" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={stats.revenueSeries}>
                    <defs>
                      <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#232330" />
                    <XAxis
                      dataKey="date"
                      stroke="#8b8b95"
                      fontSize={10}
                      tickFormatter={(d) => d.slice(5)}
                    />
                    <YAxis stroke="#8b8b95" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        background: "#13131a",
                        border: "1px solid #232330",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(v: any) => [`$${v.toFixed(2)}`, "Revenue"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ fill: "#f59e0b", r: 4 }}
                      activeDot={{ r: 6 }}
                      fill="url(#rev-grad)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top categories pie */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="mb-4">
                  <h3 className="font-display font-bold">Top Categories</h3>
                  <p className="text-xs text-muted-foreground">By revenue</p>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats.topCategories}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {stats.topCategories.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, color: "#8b8b95" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent orders */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold">Recent Orders</h3>
                <button onClick={() => setTab("orders")} className="text-xs text-hive hover:underline">
                  View all →
                </button>
              </div>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                      <th className="py-2 pr-4">Order</th>
                      <th className="py-2 pr-4">Customer</th>
                      <th className="py-2 pr-4">Region</th>
                      <th className="py-2 pr-4">Total</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 8).map((o) => (
                      <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/30">
                        <td className="py-3 pr-4 font-bold text-hive">{o.number}</td>
                        <td className="py-3 pr-4">
                          <p className="font-medium">{o.user.name}</p>
                          <p className="text-[10px] text-muted-foreground">{o.user.email}</p>
                        </td>
                        <td className="py-3 pr-4">{o.region}</td>
                        <td className="py-3 pr-4 font-bold">${o.total.toFixed(2)}</td>
                        <td className="py-3 pr-4">
                          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground text-xs">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No orders yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS */}
        {tab === "customers" && (
          <div className="space-y-4 animate-fade-in">
            <SearchBar value={search} onChange={setSearch} placeholder="Search customers by name, email, region…" />
            {filteredCustomers.length === 0 ? (
              <EmptyState icon={<Users className="size-8" />} title="No customers yet" sub="Customers will appear here after they sign up." />
            ) : (
              <div className="grid gap-3">
                {filteredCustomers.map((c) => (
                  <CustomerRow key={c.id} customer={c} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <div className="space-y-4 animate-fade-in">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by order #, customer name or email…" />
            {filteredOrders.length === 0 ? (
              <EmptyState icon={<ShoppingCart className="size-8" />} title="No orders yet" sub="Purchase history will appear here once customers place orders." />
            ) : (
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/30">
                      <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-3">Order #</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Region</th>
                        <th className="px-4 py-3">Items</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Card</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <OrderAdminRow key={o.id} order={o} revealed={revealedCards.has(o.id)} onToggle={() => toggleReveal(o.id)} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CARDS */}
        {tab === "cards" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-400">Admin-only view — sensitive data</p>
                <p className="text-xs text-muted-foreground mt-1">
                  The full card numbers and CVVs below are stored for order verification.
                  In production, never store raw CVVs — tokenise via Stripe/Braintree instead.
                </p>
              </div>
            </div>
            <SearchBar value={search} onChange={setSearch} placeholder="Search by card last4, customer name or email…" />
            {filteredCards.length === 0 ? (
              <EmptyState icon={<CreditCard className="size-8" />} title="No saved cards yet" sub="Customer payment cards will appear here after their first order." />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCards.map((c) => (
                  <AdminCard key={c.id} card={c} revealed={revealedCards.has(c.id)} onToggle={() => toggleReveal(c.id)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, trend, color,
}: {
  icon: React.ReactNode; label: string; value: string; trend: string;
  color: "hive" | "emerald" | "purple" | "amber";
}) {
  const colors = {
    hive: "bg-hive/10 border-hive/30 text-hive",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  };
  return (
    <div className="bg-card border border-border rounded-2xl p-5 relative overflow-hidden">
      <div className={`absolute -top-4 -right-4 size-20 rounded-full ${colors[color]} blur-2xl opacity-40`} />
      <div className="relative">
        <div className={`size-10 rounded-xl ${colors[color]} grid place-items-center mb-3`}>
          {icon}
        </div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-1">{trend}</p>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-card border border-border rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-hive"
      />
    </div>
  );
}

function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="text-center py-16 bg-card border border-border rounded-2xl">
      <div className="size-16 rounded-full bg-hive/10 border border-hive/30 grid place-items-center mx-auto mb-4 text-hive">
        {icon}
      </div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function CustomerRow({ customer: c }: { customer: Customer }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button onClick={() => setExpanded((v) => !v)} className="w-full flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-hive/15 border border-hive/30 grid place-items-center text-hive font-bold">
            {c.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="text-left">
            <p className="font-semibold">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Orders</p>
            <p className="font-bold">{c.totalOrders}</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Spent</p>
            <p className="font-bold text-hive">${c.totalSpent.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Region</p>
            <p className="font-semibold">{c.region}</p>
          </div>
          <ChevronRight className={`size-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border p-4 bg-background/40 grid lg:grid-cols-2 gap-6">
          {/* Purchase history */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-hive font-bold mb-3">Purchase History ({c.orders.length})</p>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {c.orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : c.orders.map((o) => (
                <div key={o.id} className="border border-border rounded-lg p-2.5 bg-card">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-hive">{o.number}</span>
                    <span className="font-bold">${o.total.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()} · {o.status}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {o.items.map((it: any, i: number) => (
                      <span key={i} className="text-[10px] bg-secondary/60 px-1.5 py-0.5 rounded">
                        {it.brand} {it.name} × {it.qty}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved cards */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-hive font-bold mb-3">Saved Cards ({c.cards.length})</p>
            <div className="space-y-2">
              {c.cards.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved cards.</p>
              ) : c.cards.map((card) => (
                <div key={card.id} className="border border-border rounded-lg p-3 bg-card">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm uppercase">{card.brand}</span>
                    <span className="text-xs">•••• {card.last4}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {card.holderName} · {card.expMonth}/{card.expYear}
                  </p>
                  {card.cardNumber && (
                    <p className="text-[10px] text-hive font-mono mt-1">
                      Full: {card.cardNumber}
                    </p>
                  )}
                  {card.cvv && (
                    <p className="text-[10px] text-hive font-mono">CVV: {card.cvv}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderAdminRow({ order: o, revealed, onToggle }: { order: AdminOrder; revealed: boolean; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr className="border-b border-border/50 hover:bg-secondary/30">
        <td className="px-4 py-3 font-bold text-hive">{o.number}</td>
        <td className="px-4 py-3">
          <p className="font-medium">{o.user.name}</p>
          <p className="text-[10px] text-muted-foreground">{o.user.email}</p>
        </td>
        <td className="px-4 py-3">{o.region}</td>
        <td className="px-4 py-3">{o.items.length}</td>
        <td className="px-4 py-3 font-bold">${o.total.toFixed(2)}</td>
        <td className="px-4 py-3">
          <span className="text-xs font-mono">•••• {o.cardLast4}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {o.status}
          </span>
        </td>
        <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
        <td className="px-4 py-3">
          <button
            onClick={() => { setExpanded((v) => !v); onToggle(); }}
            className="p-1.5 hover:bg-secondary rounded-full"
            aria-label="Expand"
          >
            {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-background/40">
          <td colSpan={9} className="px-4 py-4">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Items */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-hive font-bold mb-2">Items</p>
                <div className="space-y-2">
                  {o.items.map((it: any, i: number) => (
                    <div key={i} className="flex gap-2 items-center text-sm">
                      <div className="size-9 rounded-md overflow-hidden bg-onyx border border-border shrink-0">
                        <img src={it.image || ""} alt={it.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-hive font-bold">{it.brand}</p>
                        <p className="truncate">{it.name} × {it.qty}</p>
                      </div>
                      <span className="font-bold">${(it.price * it.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-hive font-bold mb-2">Shipping Address</p>
                <p className="text-sm">{o.shippingName}</p>
                <p className="text-xs text-muted-foreground">{o.shippingCity}, {o.shippingCountry}</p>
                <p className="text-xs text-muted-foreground">{o.shippingZip}</p>
              </div>

              {/* Payment details (admin sees full) */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-hive font-bold mb-2">Payment Details</p>
                <div className="bg-hive/5 border border-hive/20 rounded-lg p-3 text-sm font-mono space-y-1">
                  <p><span className="text-muted-foreground">Holder:</span> {o.cardHolder}</p>
                  <p><span className="text-muted-foreground">Brand:</span> {o.cardBrand}</p>
                  <p><span className="text-muted-foreground">Number:</span> <span className="text-hive">{o.cardNumber ?? `•••• ${o.cardLast4}`}</span></p>
                  <p><span className="text-muted-foreground">Expiry:</span> {o.cardExpMonth}/{o.cardExpYear}</p>
                  <p><span className="text-muted-foreground">CVV:</span> <span className="text-hive">{o.cardCvv ?? "•••"}</span></p>
                  <p><span className="text-muted-foreground">ZIP:</span> {o.cardBillingZip ?? "—"}</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function AdminCard({ card, revealed, onToggle }: { card: any; revealed: boolean; onToggle: () => void }) {
  const brandColors: Record<string, string> = {
    visa: "from-blue-600 to-blue-800",
    mastercard: "from-orange-500 to-red-600",
    amex: "from-emerald-500 to-emerald-700",
    discover: "from-orange-400 to-amber-600",
    card: "from-hive to-amber-700",
  };
  return (
    <div className={`relative aspect-[1.6/1] rounded-2xl overflow-hidden bg-gradient-to-br ${brandColors[card.brand] ?? brandColors.card} p-4 shadow-lg`}>
      {/* Hive pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(30deg, transparent 49%, rgba(255,255,255,.3) 49.5%, transparent 50%), linear-gradient(-30deg, transparent 49%, rgba(255,255,255,.3) 49.5%, transparent 50%)`,
        backgroundSize: "16px 28px",
      }} />
      <div className="relative h-full flex flex-col justify-between text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[9px] uppercase tracking-wider opacity-80">{card.brand}</p>
            <p className="text-sm font-bold mt-1">{card.customer.name}</p>
            <p className="text-[10px] opacity-70">{card.customer.email}</p>
          </div>
          <div className="size-10 rounded-full bg-white/20 grid place-items-center">
            <CreditCard className="size-5" />
          </div>
        </div>
        <div>
          <p className="text-base font-mono tracking-wider">
            {revealed && card.cardNumber ? card.cardNumber.replace(/(.{4})/g, "$1 ") : `•••• •••• •••• ${card.last4}`}
          </p>
          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="text-[8px] uppercase opacity-70">Expires</p>
              <p className="text-xs font-mono">{String(card.expMonth).padStart(2, "0")}/{String(card.expYear).slice(-2)}</p>
            </div>
            <div>
              <p className="text-[8px] uppercase opacity-70">CVV</p>
              <p className="text-xs font-mono">{revealed && card.cvv ? card.cvv : "•••"}</p>
            </div>
            <button
              onClick={onToggle}
              className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-1.5"
              aria-label="Reveal"
            >
              <Eye className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
