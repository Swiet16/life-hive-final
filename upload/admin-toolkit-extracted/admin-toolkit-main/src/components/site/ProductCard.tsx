import { CheckCircle2, AlertCircle, Flame, ShoppingCart, Eye, Zap } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
const fallback = "https://images.unsplash.com/photo-1606577924006-27d39b132ae2?auto=format&fit=crop&w=800&q=80";
import { useCart } from "@/hooks/use-cart";

export interface Product {
  id?: string;
  brand: string;
  name: string;
  spec: string;
  price: number;
  originalPrice?: number | null;
  discountEnabled?: boolean;
  monthly: number;
  badge: string;
  stock: "in" | "low" | "out";
  image?: string | null;
}

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
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
    if (soldOut) return toast.error("This product is sold out");
    setAdding(true);
    add({
      id: p.id ?? `${p.brand}-${p.name}`,
      brand: p.brand,
      name: p.name,
      price: p.price,
      image: p.image,
    });
    toast.success(`${p.brand} ${p.name} added to cart`, {
      description: `$${p.price.toFixed(2)} — view your cart in the header`,
    });
    setTimeout(() => setAdding(false), 900);
  }

  return (
    <article
      className="group relative flex flex-col overflow-hidden"
      style={{
        background: "#111214",
        border: "1px solid #222426",
        borderRadius: "4px",
        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
      }}
    >
      {/* Top-right corner accent line */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "1px",
          height: "60px",
          background: "linear-gradient(to bottom, #dc2626, transparent)",
          zIndex: 10,
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60px",
          height: "1px",
          background: "linear-gradient(to left, #dc2626, transparent)",
          zIndex: 10,
        }}
      />
      {/* Bottom-left corner accent line */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "1px",
          height: "60px",
          background: "linear-gradient(to top, #dc2626, transparent)",
          zIndex: 10,
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "60px",
          height: "1px",
          background: "linear-gradient(to right, #dc2626, transparent)",
          zIndex: 10,
        }}
      />

      {/* Badge + discount tags */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-1.5">
        <span
          style={{
            background: "#0d0e10",
            border: "1px solid #2a2c30",
            borderRadius: "2px",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "3px 8px",
            color: "#a0a0a8",
          }}
        >
          {p.badge}
        </span>
        {showDiscount && (
          <span
            style={{
              background: "#dc2626",
              borderRadius: "2px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 8px",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Flame className="size-3" />
            -{discountPct}%
          </span>
        )}
      </div>

      {/* Image area */}
      {p.id ? (
        <Link
          to="/product/$id"
          params={{ id: p.id }}
          style={{
            display: "block",
            aspectRatio: "1/1",
            background: "#0a0b0d",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={p.image || fallback}
            alt={`${p.brand} ${p.name}`}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "12px" }}
          />
          {p.stock === "low" && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                background: "rgba(217,119,6,0.15)",
                border: "1px solid rgba(217,119,6,0.35)",
                color: "#fbbf24",
                fontSize: "9px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                padding: "3px 10px",
                borderRadius: "2px",
              }}
            >
              Only a few left
            </div>
          )}
          {/* Diagonal line accent on image bottom */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40px",
              background: "linear-gradient(to top, #111214, transparent)",
              pointerEvents: "none",
            }}
          />
        </Link>
      ) : (
        <div
          style={{
            aspectRatio: "1/1",
            background: "#0a0b0d",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={p.image || fallback}
            alt={`${p.brand} ${p.name}`}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "12px" }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40px",
              background: "linear-gradient(to top, #111214, transparent)",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {/* Thin red separator line */}
      <div style={{ height: "1px", background: "linear-gradient(to right, #dc2626 0%, #3a0a0a 60%, transparent 100%)" }} />

      {/* Card body */}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Brand & name */}
        <div style={{ marginBottom: "14px" }}>
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#dc2626",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              marginBottom: "4px",
            }}
          >
            {p.brand}
          </p>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
              color: "#f0f0f2",
              margin: 0,
            }}
          >
            {p.name}
          </h3>
          <p style={{ fontSize: "11px", color: "#606068", marginTop: "3px" }}>{p.spec}</p>
        </div>

        {/* Thin divider with angular notch */}
        <div style={{ position: "relative", marginBottom: "14px" }}>
          <div style={{ height: "1px", background: "#1e2024" }} />
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              top: "-3px",
              width: "6px",
              height: "6px",
              background: "#dc2626",
              clipPath: "polygon(0 0, 100% 50%, 0 100%)",
            }}
          />
        </div>

        {/* Price + stock row */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "14px" }}>
          <div>
            <p
              style={{
                fontSize: "9px",
                color: "#4a4a52",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                marginBottom: "3px",
              }}
            >
              {showDiscount ? "Sale Price" : "From"}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              {showDiscount && (
                <span style={{ fontSize: "13px", color: "#4a4a52", textDecoration: "line-through" }}>
                  ${p.originalPrice!.toFixed(2)}
                </span>
              )}
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: showDiscount ? "#dc2626" : "#f0f0f2",
                }}
              >
                ${p.price.toFixed(2)}
              </span>
            </div>
            {showDiscount && (
              <p style={{ fontSize: "10px", color: "#34d399", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "3px" }}>
                Save ${savings.toFixed(2)}
              </p>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                justifyContent: "flex-end",
              }}
              className={stockColor}
            >
              {p.stock === "in" ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
              {stockLabel}
            </p>
            <p style={{ fontSize: "10px", color: "#4a4a52", marginTop: "3px" }}>${p.monthly}/mo</p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "auto" }}>
          <button
            onClick={handleAdd}
            disabled={soldOut}
            style={{
              position: "relative",
              padding: "11px 0",
              borderRadius: "2px",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              border: "none",
              cursor: soldOut ? "not-allowed" : "pointer",
              opacity: soldOut ? 0.4 : 1,
              background: adding ? "#059669" : soldOut ? "#1e2024" : "#dc2626",
              color: soldOut ? "#606068" : "#fff",
              transition: "background 0.2s, transform 0.15s",
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            }}
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

          {p.id ? (
            <Link
              to="/product/$id"
              params={{ id: p.id }}
              style={{
                padding: "11px 0",
                borderRadius: "2px",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                border: "1px solid #2a2c30",
                color: "#a0a0a8",
                background: "transparent",
                transition: "border-color 0.2s, color 0.2s",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#dc2626";
                (e.currentTarget as HTMLElement).style.color = "#dc2626";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#2a2c30";
                (e.currentTarget as HTMLElement).style.color = "#a0a0a8";
              }}
            >
              <Eye className="size-3" />
              View Details
            </Link>
          ) : (
            <button
              style={{
                padding: "11px 0",
                borderRadius: "2px",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                border: "1px solid #2a2c30",
                color: "#a0a0a8",
                background: "transparent",
                cursor: "pointer",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
            >
              <Zap className="size-3" />
              Get Quote
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
