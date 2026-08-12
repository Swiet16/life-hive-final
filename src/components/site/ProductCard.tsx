"use client";

import { CheckCircle2, AlertCircle, Flame, ShoppingCart, Eye, Star } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useUI } from "@/lib/ui-store";

export interface Product {
  id: string;
  brand: string;
  name: string;
  spec: string;
  price: number;
  originalPrice?: number | null;
  discountEnabled?: boolean;
  monthly: number;
  badge: string;
  stock: "in" | "low" | "out";
  // Support both `image` (legacy) and `imageUrl` (current Supabase schema)
  image?: string | null;
  imageUrl?: string | null;
  images?: string[] | null;
  rating?: number;
  reviews?: number;
  category?: string;
  description?: string;
  longDescription?: string;
}

function primaryImage(p: Product): string {
  if (p.imageUrl) return p.imageUrl;
  if (p.image) return p.image;
  if (Array.isArray(p.images) && p.images.length > 0) return p.images[0];
  return "https://images.unsplash.com/photo-1606577924006-27d39b132ae2?auto=format&fit=crop&w=800&q=80";
}

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const navigate = useUI((s) => s.navigate);
  const [adding, setAdding] = useState(false);

  const stockLabel = p.stock === "in" ? "In Stock" : p.stock === "low" ? "Low Stock" : "Sold Out";
  const stockColor =
    p.stock === "in" ? "text-emerald-400" : p.stock === "low" ? "text-amber-400" : "text-zinc-500";

  const showDiscount = !!(p.discountEnabled && p.originalPrice && p.originalPrice > p.price);
  const discountPct = showDiscount
    ? Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100)
    : 0;
  const savings = showDiscount ? p.originalPrice! - p.price : 0;
  const soldOut = p.stock === "out";

  function handleAdd() {
    if (soldOut) {
      toast.error("This product is sold out");
      return;
    }
    setAdding(true);
    add({
      id: p.id,
      brand: p.brand,
      name: p.name,
      price: p.price,
      image: primaryImage(p),
    });
    toast.success(`${p.brand} ${p.name} added to cart`, {
      description: `$${p.price.toFixed(2)} — tap cart to checkout`,
    });
    setTimeout(() => setAdding(false), 900);
  }

  return (
    <article
      className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden transition-all hover:border-hive/40 hover:shadow-[0_8px_40px_-12px_rgba(245,158,11,0.25)] hover:-translate-y-1"
    >
      {/* Image */}
      <button
        onClick={() => navigate({ name: "product", id: p.id })}
        className="block relative aspect-square bg-onyx overflow-hidden"
      >
        <img
          src={primaryImage(p)}
          alt={`${p.brand} ${p.name}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="bg-background/90 backdrop-blur border border-border text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-muted-foreground">
            {p.badge}
          </span>
          {showDiscount && (
            <span className="bg-hive text-onyx text-[10px] font-bold uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
              <Flame className="size-3" />
              -{discountPct}%
            </span>
          )}
        </div>

        {p.stock === "low" && (
          <div className="absolute bottom-3 left-3 bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            Only a few left
          </div>
        )}

        {p.rating !== undefined && (
          <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur border border-border rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] font-bold">
            <Star className="size-2.5 fill-hive text-hive" />
            <span>{p.rating.toFixed(1)}</span>
          </div>
        )}
      </button>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-3">
          <p className="text-[10px] font-bold text-hive uppercase tracking-[0.18em] mb-1">
            {p.brand}
          </p>
          <h3
            className="text-base font-semibold leading-snug cursor-pointer hover:text-hive transition-colors line-clamp-2"
            onClick={() => navigate({ name: "product", id: p.id })}
          >
            {p.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{p.spec}</p>
        </div>

        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">
              {showDiscount ? "Sale Price" : "Price"}
            </p>
            <div className="flex items-baseline gap-2">
              {showDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  ${p.originalPrice!.toFixed(2)}
                </span>
              )}
              <span className={`text-xl font-bold ${showDiscount ? "text-hive" : "text-foreground"}`}>
                ${p.price.toFixed(2)}
              </span>
            </div>
            {showDiscount && (
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                Save ${savings.toFixed(2)}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground mt-0.5">
              or ${p.monthly.toFixed(2)}/mo
            </p>
          </div>
          <div className="text-right">
            <p className={`text-[10px] font-semibold flex items-center gap-1 justify-end ${stockColor}`}>
              {p.stock === "in" ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
              {stockLabel}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 mt-auto">
          <button
            onClick={handleAdd}
            disabled={soldOut}
            className={`text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              soldOut
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : adding
                ? "bg-emerald-500 text-white"
                : "bg-hive text-onyx hover:brightness-110"
            }`}
          >
            {adding ? (
              <>
                <CheckCircle2 className="size-3.5" />
                Added!
              </>
            ) : soldOut ? (
              "Sold Out"
            ) : (
              <>
                <ShoppingCart className="size-3.5" />
                Add to Cart
              </>
            )}
          </button>
          <button
            onClick={() => navigate({ name: "product", id: p.id })}
            className="px-3 text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-lg border border-border hover:border-hive/50 hover:text-hive transition-colors flex items-center justify-center"
            aria-label="View details"
          >
            <Eye className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
