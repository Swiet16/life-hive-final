"use client";

import { useState } from "react";
import { ShoppingCart, User, Menu, X, Shield, LogOut, LayoutDashboard, Search } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth-store";
import { useCart } from "@/lib/cart-store";
import { useUI } from "@/lib/ui-store";
import { getRegion, REGIONS } from "@/lib/regions";

const NAV_CATEGORIES = [
  "electronics", "home", "fashion", "beauty", "sports", "grocery", "toys", "books",
];

const CATEGORY_LABELS: Record<string, string> = {
  electronics: "Electronics",
  home: "Home",
  fashion: "Fashion",
  beauty: "Beauty",
  sports: "Sports",
  grocery: "Grocery",
  toys: "Toys",
  books: "Books",
};

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const { user, logout } = useAuth();
  const cartCount = useCart((s) => s.count());
  const { navigate, setCartOpen, setAuthOpen } = useUI();
  const region = getRegion(user?.region);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ name: "shop", q: searchQ || undefined });
  }

  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      {/* Utility bar */}
      <div className="border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-9 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <div className="flex gap-3 items-center">
            <span className="hidden sm:inline">Ship to:</span>
            <span className="flex items-center gap-1.5 text-foreground/80">
              <span className="text-sm leading-none">{region.flag}</span>
              <span>{region.label}</span>
              <span className="text-hive">·</span>
              <span>{region.currency}</span>
            </span>
            <span className="size-1.5 rounded-full bg-hive animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Free shipping over $99</span>
            <span className="hidden md:inline text-hive-soft">·</span>
            <a href="mailto:hello@lifehive.store" className="hover:text-foreground transition-colors">hello@lifehive.store</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20 gap-3">
          <div className="flex items-center gap-8">
            <Logo size={36} />
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => navigate({ name: "shop" })}
                className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                All Products
              </button>
              {NAV_CATEGORIES.slice(0, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => navigate({ name: "shop", category: c })}
                  className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  {CATEGORY_LABELS[c]}
                </button>
              ))}
            </nav>
          </div>

          {/* Search bar (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search everything you need…"
                className="w-full bg-secondary/60 border border-border rounded-full pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-hive focus:bg-secondary transition-colors"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {user ? (
              <>
                {user.role === "admin" && (
                  <button
                    onClick={() => navigate({ name: "admin" })}
                    className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-2 border border-hive/40 text-hive rounded-full hover:bg-hive/10 transition-colors"
                  >
                    <Shield className="size-3.5" />
                    <span>Admin</span>
                  </button>
                )}
                <button
                  onClick={() => navigate({ name: "account" })}
                  className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-2 border border-border rounded-full hover:bg-secondary transition-colors"
                >
                  <LayoutDashboard className="size-3.5" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={async () => { await logout(); navigate({ name: "home" }); }}
                  className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="size-4" />
                </button>
                <div className="hidden sm:flex size-9 rounded-full bg-hive/15 border border-hive/30 items-center justify-center text-hive font-bold text-sm">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
              </>
            ) : (
              <button
                onClick={() => setAuthOpen(true, "login")}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 sm:px-4 py-2 border border-border rounded-full hover:bg-secondary hover:border-hive/40 transition-colors"
              >
                <User className="size-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-hive text-onyx px-3 sm:px-4 py-2 sm:py-2.5 rounded-full hover-glow font-semibold text-xs flex items-center gap-1.5"
            >
              <ShoppingCart className="size-3.5" />
              <span className="hidden sm:inline">Cart</span>
              <span className="font-bold">{cartCount}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-background text-foreground text-[9px] font-bold grid place-items-center border border-hive animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 -mr-1 text-foreground"
              aria-label="Menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search…"
                  className="w-full bg-secondary/60 border border-border rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-hive"
                />
              </div>
            </form>
            <button
              onClick={() => { navigate({ name: "shop" }); setOpen(false); }}
              className="block w-full text-left px-3 py-2.5 rounded-md hover:bg-secondary text-foreground/80"
            >
              All Products
            </button>
            {NAV_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { navigate({ name: "shop", category: c }); setOpen(false); }}
                className="block w-full text-left px-3 py-2.5 rounded-md hover:bg-secondary text-foreground/80"
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
            {user && (
              <>
                <div className="border-t border-border my-2" />
                {user.role === "admin" && (
                  <button
                    onClick={() => { navigate({ name: "admin" }); setOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-hive hover:bg-hive/10 w-full text-left"
                  >
                    <Shield className="size-4" /> Admin Console
                  </button>
                )}
                <button
                  onClick={() => { navigate({ name: "account" }); setOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-secondary text-foreground/80 w-full text-left"
                >
                  <LayoutDashboard className="size-4" /> My Orders
                </button>
                <button
                  onClick={async () => { await logout(); setOpen(false); navigate({ name: "home" }); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-secondary text-foreground/80 w-full text-left"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
