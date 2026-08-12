import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, User, Menu, X, LayoutDashboard, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { useCart } from "@/hooks/use-cart";
import { NotificationsBell } from "./NotificationsBell";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop Tires" },
  { to: "/wheels", label: "Wheels" },
  { to: "/deals", label: "Deals" },
  { to: "/brands", label: "Brands" },
  { to: "/financing", label: "Financing" },
  { to: "/track-order", label: "Track Order" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [region, setRegion] = useState<"US" | "CA">("US");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const { count: cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Utility bar */}
        <div className="flex justify-between items-center h-10 border-b border-border text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          <div className="flex gap-1 items-center">
            <span className="mr-3 hidden sm:inline">Region:</span>
            <button
              onClick={() => setRegion("US")}
              className={`px-2 py-1 transition-colors ${region === "US" ? "text-foreground" : "hover:text-foreground/70"}`}
            >
              <span className="mr-1">🇺🇸</span>USA
            </button>
            <span className="text-border">/</span>
            <button
              onClick={() => setRegion("CA")}
              className={`px-2 py-1 transition-colors ${region === "CA" ? "text-foreground" : "hover:text-foreground/70"}`}
            >
              <span className="mr-1">🇨🇦</span>Canada
            </button>
            <span className="ml-2 size-1.5 rounded-full bg-racing-red" />
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/15303505985"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              aria-label="Chat on WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
              <span className="hidden sm:inline">+1 530 350 5985</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Main nav */}
        <div className="flex justify-between items-center h-16 sm:h-20 gap-2">
          <div className="flex items-center gap-12">
            <Link to="/" className="font-display text-2xl sm:text-3xl tracking-tight flex items-center">
              WHEEL<span className="text-racing-red">DEELZ</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-silver/80">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="hover:text-foreground transition-colors"
                  activeProps={{ className: "text-foreground" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationsBell />
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2 border border-racing-red/50 text-racing-red rounded-full hover:bg-racing-red/10 transition-colors">
                    <Shield className="size-3.5" />
                    <span>Admin</span>
                  </Link>
                )}
                <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2 border border-border rounded-full hover:bg-secondary transition-colors">
                  <LayoutDashboard className="size-3.5" />
                  <span>Dashboard</span>
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-2 border border-border rounded-full hover:bg-secondary transition-colors"
              >
                <User className="size-3.5" />
                <span>Sign In</span>
              </Link>
            )}
            <Link to="/checkout" className="relative bg-racing-red px-3 sm:px-5 py-2 sm:py-2.5 rounded-sm group cursor-pointer overflow-hidden hover-glow">
              <span className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white">
                <ShoppingCart className="size-3.5" />
                <span className="hidden sm:inline">Cart</span> ({cartCount})
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-foreground text-background text-[10px] font-bold grid place-items-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 -mr-1"
              aria-label="Menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden pb-6 flex flex-col gap-1 text-sm font-medium">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md hover:bg-secondary text-silver/80"
                activeProps={{ className: "text-foreground bg-secondary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-border my-2" />

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-racing-red hover:bg-racing-red/10"
                  >
                    <Shield className="size-4" /> Admin Console
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-secondary text-silver/80"
                >
                  <LayoutDashboard className="size-4" /> Dashboard
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-secondary text-silver/80 text-left"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-racing-red text-white font-semibold"
              >
                <User className="size-4" /> Sign In / Create Account
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
