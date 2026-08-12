"use client";

import { useEffect, useState, useMemo } from "react";
import { ProductCard, type Product } from "./ProductCard";
import { useUI } from "@/lib/ui-store";
import { Filter, Search, SlidersHorizontal } from "lucide-react";

type Category = { id: string; slug: string; name: string };

export function ShopView({ category, q }: { category?: string; q?: string }) {
  const navigate = useUI((s) => s.navigate);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"new" | "low" | "high" | "rating">("new");
  const [search, setSearch] = useState(q ?? "");

  useEffect(() => {
    setSearch(q ?? "");
  }, [q]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, q]);

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === "low") arr.sort((a, b) => a.price - b.price);
    if (sort === "high") arr.sort((a, b) => b.price - a.price);
    if (sort === "rating") arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return arr;
  }, [products, sort]);

  const activeCat = categories.find((c) => c.slug === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.25em] text-hive font-bold mb-2">
          Life Hive · Shop
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">
          {activeCat ? activeCat.name : q ? `Results for "${q}"` : "All Products"}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {loading ? "Loading…" : `${sorted.length} products available`}
        </p>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => navigate({ name: "shop" })}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            !category ? "bg-hive text-onyx" : "bg-secondary text-foreground/80 hover:bg-secondary/70"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate({ name: "shop", category: c.slug })}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              category === c.slug ? "bg-hive text-onyx" : "bg-secondary text-foreground/80 hover:bg-secondary/70"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Sort + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate({ name: "shop", q: search || undefined });
            }}
            placeholder="Search products…"
            className="w-full bg-secondary/60 border border-border rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-hive"
          />
        </div>
        <div className="flex items-center gap-2 bg-secondary/60 border border-border rounded-full px-4 py-2.5">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-transparent text-sm focus:outline-none cursor-pointer"
          >
            <option value="new">Newest</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-secondary/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <div className="size-20 rounded-full bg-hive/10 border border-hive/30 grid place-items-center mx-auto mb-4">
            <Filter className="size-9 text-hive/60" />
          </div>
          <p className="font-semibold text-lg">No products found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try a different search or browse all products.
          </p>
          <button
            onClick={() => navigate({ name: "shop" })}
            className="mt-4 bg-hive text-onyx px-5 py-2.5 rounded-full font-bold text-sm hover-glow"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sorted.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
