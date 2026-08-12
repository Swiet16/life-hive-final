"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/lib/ui-store";
import { useCart } from "@/lib/cart-store";
import {
  ArrowLeft, ShoppingCart, Check, Star, Truck, ShieldCheck, RefreshCw, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "./ProductCard";
import type { Product } from "./ProductCard";

export function ProductView({ id }: { id: string }) {
  const navigate = useUI((s) => s.navigate);
  const { add } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products`)
      .then((r) => r.json())
      .then((d) => {
        const p = (d.products ?? []).find((x: Product) => x.id === id);
        if (p) {
          setProduct(p);
          const rel = (d.products ?? [])
            .filter((x: Product) => x.id !== id && x.brand === p.brand)
            .slice(0, 4);
          setRelated(rel);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-secondary/40 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-secondary/40 rounded animate-pulse" />
            <div className="h-4 bg-secondary/40 rounded w-2/3 animate-pulse" />
            <div className="h-12 bg-secondary/40 rounded w-1/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-2xl font-bold">Product not found</p>
        <button
          onClick={() => navigate({ name: "shop" })}
          className="mt-4 bg-hive text-onyx px-5 py-2.5 rounded-full font-bold text-sm hover-glow"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  function handleAdd() {
    if (!product) return;
    setAdding(true);
    for (let i = 0; i < qty; i++) {
      add({
        id: product.id,
        brand: product.brand,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    toast.success(`${product.brand} ${product.name} × ${qty} added to cart`);
    setTimeout(() => setAdding(false), 900);
  }

  const showDiscount = !!(product.discountEnabled && product.originalPrice && product.originalPrice > product.price);
  const discountPct = showDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <button onClick={() => navigate({ name: "home" })} className="hover:text-foreground">Home</button>
        <ChevronRight className="size-3" />
        <button onClick={() => navigate({ name: "shop" })} className="hover:text-foreground">Shop</button>
        <ChevronRight className="size-3" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <button
        onClick={() => navigate({ name: "shop" })}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" /> Back to Shop
      </button>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="relative aspect-square bg-card border border-border rounded-2xl overflow-hidden">
          <img
            src={product.image || ""}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {showDiscount && (
            <div className="absolute top-4 left-4 bg-hive text-onyx px-3 py-1.5 rounded-full text-xs font-bold">
              -{discountPct}% OFF
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-[11px] uppercase tracking-[0.25em] text-hive font-bold mb-2">
            {product.brand}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            {product.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{product.spec}</p>

          {product.rating !== undefined && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`size-4 ${
                      s <= Math.round(product.rating!)
                        ? "fill-hive text-hive"
                        : "fill-secondary text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold">{product.rating!.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({product.reviews ?? 0} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className={`text-3xl font-bold ${showDiscount ? "text-hive" : "text-foreground"}`}>
              ${product.price.toFixed(2)}
            </span>
            {showDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
            <span className="text-sm text-muted-foreground ml-2">
              or ${product.monthly.toFixed(2)}/mo
            </span>
          </div>

          <p className="text-sm text-foreground/80 mt-5 leading-relaxed">
            {product.description}
          </p>

          {/* Stock */}
          <div className="mt-5 flex items-center gap-2 text-sm">
            {product.stock === "in" && (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="size-4" /> In stock — ready to ship
              </span>
            )}
            {product.stock === "low" && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Check className="size-4" /> Low stock — order soon
              </span>
            )}
            {product.stock === "out" && (
              <span className="flex items-center gap-1.5 text-red-400">Sold out</span>
            )}
          </div>

          {/* Quantity + add */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-1 bg-secondary border border-border rounded-full p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="size-9 rounded-full hover:bg-background grid place-items-center font-bold"
              >
                −
              </button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="size-9 rounded-full hover:bg-background grid place-items-center font-bold"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === "out" || adding}
              className="flex-1 bg-hive text-onyx py-3 rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? (
                <>
                  <Check className="size-4" /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="size-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-border">
            {[
              { icon: Truck, label: "Free shipping over $99" },
              { icon: ShieldCheck, label: "Secure checkout" },
              { icon: RefreshCw, label: "30-day returns" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center text-center gap-1.5">
                <f.icon className="size-5 text-hive" />
                <p className="text-[10px] text-muted-foreground leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">More from {product.brand}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
