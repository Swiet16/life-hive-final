"use client";

import { useEffect, useRef } from "react";
import { Mail, MapPin, Phone, Shield, Truck, RefreshCw, Headphones } from "lucide-react";
import { Logo } from "./Logo";
import { useUI } from "@/lib/ui-store";

const TICKER_ITEMS = [
  "🛍️ Everything you need, in one hive",
  "🚚 Fast, tracked & insured shipping",
  "🔒 Secure checkout — your data is protected",
  "↩️ 30-day easy returns",
  "📞 24/7 customer support",
  "🌍 Shipping across 10+ regions",
  "💳 Pay your way — cards, wallets, financing",
  "✅ Quality verified before dispatch",
];

function Ticker() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    let raf: number;
    const speed = 0.5;
    function step() {
      x -= speed;
      const half = track!.scrollWidth / 2;
      if (Math.abs(x) >= half) x = 0;
      track!.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-hive/20 bg-gradient-to-r from-onyx via-[#1a1407] to-onyx py-3 select-none">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-onyx to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-onyx to-transparent z-10 pointer-events-none" />
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-silver/70 mx-8">
            {item}
            <span className="text-hive mx-2">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  const navigate = useUI((s) => s.navigate);

  return (
    <footer className="bg-onyx mt-24">
      <Ticker />

      {/* Feature strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-border">
        {[
          { icon: Truck, title: "Free Shipping", sub: "On orders over $99" },
          { icon: RefreshCw, title: "30-Day Returns", sub: "Hassle-free returns" },
          { icon: Shield, title: "Secure Payment", sub: "Encrypted checkout" },
          { icon: Headphones, title: "24/7 Support", sub: "We're here to help" },
        ].map((f) => (
          <div key={f.title} className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-hive/10 border border-hive/30 grid place-items-center shrink-0">
              <f.icon className="size-5 text-hive" />
            </div>
            <div>
              <p className="font-semibold text-sm">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-2">
          <Logo size={40} />
          <p className="text-sm text-muted-foreground mt-5 max-w-sm leading-relaxed">
            Life Hive is your home for everything — electronics, fashion, home goods,
            beauty, sports and more. Curated quality, transparent pricing, and a hive
            of choices delivered to your door.
          </p>
          <div className="mt-6 space-y-2.5 text-xs text-muted-foreground">
            <a href="mailto:hello@lifehive.store" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="size-3.5 text-hive" /> hello@lifehive.store
            </a>
            <a href="tel:+18005434483" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="size-3.5 text-hive" /> +1 800 LIFE HIVE
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 text-hive" /> Serving 10+ regions worldwide
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-hive mb-4 font-bold">Shop</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><button onClick={() => navigate({ name: "shop", category: "electronics" })} className="hover:text-foreground">Electronics</button></li>
            <li><button onClick={() => navigate({ name: "shop", category: "home" })} className="hover:text-foreground">Home & Living</button></li>
            <li><button onClick={() => navigate({ name: "shop", category: "fashion" })} className="hover:text-foreground">Fashion</button></li>
            <li><button onClick={() => navigate({ name: "shop", category: "beauty" })} className="hover:text-foreground">Beauty & Care</button></li>
            <li><button onClick={() => navigate({ name: "shop", category: "sports" })} className="hover:text-foreground">Sports & Outdoor</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-hive mb-4 font-bold">Support</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><button onClick={() => navigate({ name: "account" })} className="hover:text-foreground">Track Order</button></li>
            <li><a href="#" className="hover:text-foreground">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-foreground">Returns</a></li>
            <li><a href="#" className="hover:text-foreground">Warranty</a></li>
            <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>© {new Date().getFullYear()} Life Hive. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
