"use client";

import { ArrowRight, Sparkles, Search } from "lucide-react";
import { useUI } from "@/lib/ui-store";

export function Hero() {
  const navigate = useUI((s) => s.navigate);

  return (
    <section className="relative overflow-hidden grid-hive-bg">
      {/* Honeycomb background accents */}
      <div className="absolute -top-32 -right-32 size-96 rounded-full bg-hive/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-hive-soft/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-hive font-bold border border-hive/30 bg-hive/5 px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="size-3.5" />
              Everything is here
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
              Your hive for
              <span className="block bg-gradient-to-r from-hive via-hive-soft to-hive bg-clip-text text-transparent">
                everything you need
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-6 max-w-md leading-relaxed">
              From electronics to fashion, home goods to beauty — Life Hive brings the
              world's best products to your door. Curated, affordable, and always buzzing
              with fresh deals.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate({ name: "shop" })}
                className="group bg-hive text-onyx px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover-glow"
              >
                Start Shopping
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate({ name: "shop", category: "electronics" })}
                className="px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider border border-border hover:border-hive/50 hover:bg-secondary transition-colors"
              >
                Browse Electronics
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <p className="text-3xl font-bold text-hive">10K+</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-hive">10+</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">Regions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-hive">50K+</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">Happy Hive</p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Hexagonal frame */}
              <div className="absolute inset-0 hex-clip bg-gradient-to-br from-hive/20 via-hive/5 to-transparent" />
              <div className="absolute inset-2 hex-clip overflow-hidden border border-hive/30">
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80"
                  alt="Life Hive shopping"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-card border border-hive/30 rounded-2xl p-3 shadow-lg animate-float" style={{ animationDelay: "0s" }}>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-emerald-500/20 grid place-items-center">
                    <span className="text-emerald-400 text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold">Secure</p>
                    <p className="text-[10px] text-muted-foreground">Checkout</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/3 -right-6 bg-card border border-hive/30 rounded-2xl p-3 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-hive/20 grid place-items-center">
                    <Search className="size-4 text-hive" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">10K+ Items</p>
                    <p className="text-[10px] text-muted-foreground">In stock</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 left-1/4 bg-card border border-hive/30 rounded-2xl p-3 shadow-lg animate-float" style={{ animationDelay: "2s" }}>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-purple-500/20 grid place-items-center">
                    <span className="text-purple-400 text-sm">★</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold">4.9 / 5</p>
                    <p className="text-[10px] text-muted-foreground">50K+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
