import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Link } from "@tanstack/react-router";

export function FeaturedProducts() {
  const { products, loading } = useProducts({ featured: true });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-24">
      <div className="flex flex-wrap justify-between items-end gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-racing-red font-bold">
            Curated Selection
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mt-2">
            Top tier performance
          </h2>
          <p className="text-silver/50 text-sm mt-2 max-w-md">
            Hand-selected by our team for the current season — built for grip, longevity, and luxury.
          </p>
        </div>
        <Link
          to="/shop"
          className="text-[10px] font-bold uppercase tracking-[0.25em] border-b border-racing-red pb-1 hover:text-racing-red transition-colors"
        >
          View Entire Shop →
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[460px] rounded-2xl border border-border bg-graphite/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              p={{
                id: p.id,
                brand: p.brand,
                name: p.name,
                spec: p.spec,
                price: Number(p.price),
                originalPrice: p.original_price ? Number(p.original_price) : null,
                discountEnabled: p.discount_enabled,
                monthly: p.monthly,
                badge: p.badge,
                stock: p.stock,
                image: p.image_url,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
