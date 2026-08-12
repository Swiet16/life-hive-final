"use client";

import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useUI } from "@/lib/ui-store";
import { useAuth } from "@/lib/auth-store";
import { getRegion } from "@/lib/regions";

export function CartDrawer() {
  const { cartOpen, setCartOpen, navigate, setAuthOpen } = useUI();
  const { items, setQty, remove, subtotal } = useCart();
  const { user } = useAuth();
  const region = getRegion(user?.region);

  if (!cartOpen) return null;

  const sub = subtotal();
  const tax = +(sub * region.taxRate).toFixed(2);
  const shipping = sub > 99 || sub === 0 ? 0 : 9.99;
  const total = sub + tax + shipping;

  function goCheckout() {
    setCartOpen(false);
    if (!user) {
      setAuthOpen(true, "signup");
      return;
    }
    navigate({ name: "checkout" });
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <aside className="ml-auto relative w-full max-w-md h-full bg-card border-l border-border flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="size-5 text-hive" />
            <h2 className="font-display text-lg font-bold">Your Cart</h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="size-20 rounded-full bg-hive/10 border border-hive/30 grid place-items-center">
              <ShoppingBag className="size-9 text-hive/60" />
            </div>
            <div>
              <p className="font-semibold">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Browse our hive of products and find what you love.
              </p>
            </div>
            <button
              onClick={() => { setCartOpen(false); navigate({ name: "shop" }); }}
              className="bg-hive text-onyx px-5 py-2.5 rounded-full font-bold text-sm hover-glow"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex gap-3 bg-background/40 border border-border rounded-xl p-3"
                >
                  <div className="size-16 shrink-0 rounded-lg overflow-hidden bg-onyx border border-border">
                    <img
                      src={it.image || "https://images.unsplash.com/photo-1606577924006-27d39b132ae2?auto=format&fit=crop&w=200&q=80"}
                      alt={it.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-hive font-bold">
                      {it.brand}
                    </p>
                    <p className="text-sm font-semibold leading-snug truncate">
                      {it.name}
                    </p>
                    <p className="text-sm text-hive font-bold mt-1">
                      ${it.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 bg-secondary border border-border rounded-full p-0.5">
                        <button
                          onClick={() => setQty(it.id, it.qty - 1)}
                          className="size-6 rounded-full hover:bg-background grid place-items-center transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{it.qty}</span>
                        <button
                          onClick={() => setQty(it.id, it.qty + 1)}
                          className="size-6 rounded-full hover:bg-background grid place-items-center transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(it.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-border p-5 space-y-3 bg-background/60">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${sub.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({(region.taxRate * 100).toFixed(0)}%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-hive">${total.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <p className="text-[11px] text-center text-muted-foreground">
                  Add <span className="text-hive font-bold">${(99 - sub).toFixed(2)}</span> more for FREE shipping
                </p>
              )}

              <button
                onClick={goCheckout}
                className="w-full bg-hive text-onyx py-3.5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover-glow"
              >
                {user ? "Proceed to Checkout" : "Sign in to Checkout"}
                <ArrowRight className="size-4" />
              </button>
              <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="size-3 text-emerald-400" />
                Secure encrypted checkout
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
