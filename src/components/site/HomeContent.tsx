"use client";

import { useEffect, useState } from "react";
import { ProductCard, type Product } from "./ProductCard";
import { useUI } from "@/lib/ui-store";
import { ArrowRight } from "lucide-react";

type Category = { id: string; slug: string; name: string; icon: string };

const ICONS: Record<string, string> = {
  cpu: "💻",
  sofa: "🛋️",
  shirt: "👕",
  sparkles: "✨",
  dumbbell: "🏋️",
  "shopping-basket": "🛒",
  baby: "🧸",
  book: "📚",
};

export function HomeContent() {
  const navigate = useUI((s) => s.navigate);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?featured=1").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([f, p, c]) => {
        setFeatured(f.products ?? []);
        setNewProducts((p.products ?? []).slice(0, 10));
        setCategories(c.categories ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Category strip */}
      <section className="border-y border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate({ name: "shop", category: c.slug })}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary/50 transition-colors group"
              >
                <div className="size-12 rounded-full bg-hive/10 border border-hive/30 grid place-items-center text-xl group-hover:bg-hive/20 group-hover:scale-105 transition-all">
                  {ICONS[c.icon] ?? "🛍️"}
                </div>
                <p className="text-[10px] sm:text-xs font-semibold text-center">{c.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-hive font-bold mb-2">
              Hand-picked for you
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Featured Products</h2>
          </div>
          <button
            onClick={() => navigate({ name: "shop" })}
            className="hidden sm:flex items-center gap-1.5 text-sm text-hive hover:underline"
          >
            View all <ArrowRight className="size-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-secondary/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-hive/30 bg-gradient-to-br from-hive/15 via-card to-card p-8 sm:p-12">
          <div className="absolute -top-20 -right-20 size-64 rounded-full bg-hive/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-hive-soft/10 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-hive font-bold mb-2">
                Life Hive Membership
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                Join the hive — unlock member-only deals & free shipping
              </h3>
              <p className="text-sm text-muted-foreground mt-3 max-w-md">
                Create a free account today and get early access to flash sales, member-exclusive
                discounts, and free shipping on every order over $49.
              </p>
              <button
                onClick={() => navigate({ name: "shop" })}
                className="mt-5 bg-hive text-onyx px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider hover-glow inline-flex items-center gap-2"
              >
                Start Shopping <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="grid grid-cols-3 gap-3">
                {["🛍️", "🚚", "🔒", "💳", "🌍", "↩️"].map((emoji, i) => (
                  <div
                    key={i}
                    className="size-20 rounded-2xl bg-background/60 border border-hive/20 grid place-items-center text-3xl animate-float"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-hive font-bold mb-2">
              Fresh in the hive
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">New Arrivals</h2>
          </div>
          <button
            onClick={() => navigate({ name: "shop" })}
            className="hidden sm:flex items-center gap-1.5 text-sm text-hive hover:underline"
          >
            View all <ArrowRight className="size-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-secondary/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
