import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";

const DISPATCH_ITEMS = [
  "🚚 Dispatching across USA & Canada",
  "📦 Fast shipping — tracked & insured",
  "🛞 Premium tires & wheels, delivered",
  "⚡ Same-day processing on all orders",
  "🏁 Performance parts for every build",
  "✅ Admin-verified before every shipment",
  "🔒 Secure checkout — card details protected",
  "📍 Serving USA & Canada nationwide",
];

function DispatchTicker() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    let raf: number;
    const speed = 0.6;

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

  const doubled = [...DISPATCH_ITEMS, ...DISPATCH_ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-border bg-onyx/80 py-3 select-none">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-onyx/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-onyx/80 to-transparent z-10 pointer-events-none" />
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-silver/60 mx-8">
            {item}
            <span className="text-racing-red mx-2">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-onyx mt-24">
      <DispatchTicker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
        <div className="lg:col-span-2">
          <Link to="/" className="font-display text-3xl tracking-tight">
            WHEEL<span className="text-racing-red">DEELZ</span>
          </Link>
          <p className="text-sm text-silver/50 mt-4 max-w-sm">
            Premium tires and wheels engineered for the North American driver. Curated
            performance, transparent pricing, and flexible financing.
          </p>
          <div className="mt-6 space-y-2 text-xs text-silver/60">
            <a
              href="https://wa.me/15303505985"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-emerald-300 text-emerald-400 transition-colors font-medium"
            >
              <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="currentColor">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              </svg>
              <span>+1 530 350 5985 (WhatsApp only)</span>
            </a>
            <a href="mailto:wheeldeelz@outlook.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="size-3.5 shrink-0" />
              <span>wheeldeelz@outlook.com</span>
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 shrink-0" />
              <span>Serving USA & Canada</span>
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-silver/40 mb-4">Shop</h4>
          <ul className="space-y-3 text-sm text-silver/70">
            <li><Link to="/shop" className="hover:text-foreground">All Tires</Link></li>
            <li><Link to="/wheels" className="hover:text-foreground">Wheels</Link></li>
            <li><Link to="/deals" className="hover:text-foreground">Deals</Link></li>
            <li><Link to="/brands" className="hover:text-foreground">Brands</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-silver/40 mb-4">Support</h4>
          <ul className="space-y-3 text-sm text-silver/70">
            <li><Link to="/financing" className="hover:text-foreground">Financing</Link></li>
            <li><Link to="/track-order" className="hover:text-foreground">Track Order</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><a href="#" className="hover:text-foreground">Warranty</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-silver/40">
          <span>© {new Date().getFullYear()} WheelDeelz. All rights reserved.</span>
          <div className="flex gap-6 mt-3 sm:mt-0">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
