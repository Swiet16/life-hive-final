import { useEffect, useState, useCallback } from "react";
import { Search, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BRANDS_BY_CATEGORY } from "@/lib/catalog";
import { useNavigate } from "@tanstack/react-router";

const heroFallback = "https://images.unsplash.com/photo-1606577924006-27d39b132ae2?auto=format&fit=crop&w=1920&q=80";

type Tab = "vehicle" | "size" | "brand";
type HeroSlide = {
  id: string;
  headline: string;
  subheadline: string;
  cta_label: string;
  cta_href: string;
  image_url: string | null;
};

const TIRE_WIDTHS = ["165","175","185","195","205","215","225","235","245","255","265","275","285","295","305","315","325","335"];
const ASPECT_RATIOS = ["25","30","35","40","45","50","55","60","65","70","75","80"];
const RIM_SIZES = ["13","14","15","16","17","18","19","20","21","22","24"];

const MAKES = ["Toyota","Honda","Ford","Chevrolet","BMW","Mercedes-Benz","Audi","Dodge","RAM","Jeep","GMC","Nissan","Hyundai","Kia","Subaru","Lexus","Cadillac","Porsche","Tesla","Volkswagen"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 25 }, (_, i) => String(CURRENT_YEAR - i));

const TIRE_BRANDS = BRANDS_BY_CATEGORY.tires;

export function Hero() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("vehicle");
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [width, setWidth] = useState("");
  const [aspect, setAspect] = useState("");
  const [rim, setRim] = useState("");
  const [brand, setBrand] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("hero_images" as any)
        .select("id,headline,subheadline,cta_label,cta_href,image_url")
        .eq("active", true)
        .order("sort_order");
      if (data && (data as any[]).length > 0) setSlides(data as any);
    })();
  }, []);

  const goToSlide = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const next = useCallback(() => {
    if (slides.length < 2) return;
    goToSlide((current + 1) % slides.length);
  }, [slides.length, current, goToSlide]);

  const prev = useCallback(() => {
    if (slides.length < 2) return;
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [slides.length, current, goToSlide]);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [slides.length, next]);

  const slide = slides[current];
  const headline = slide?.headline ?? "Engineered for supreme performance";
  const subheadline = slide?.subheadline ?? "Premium tires curated for North American roads.";
  const ctaLabel = slide?.cta_label ?? "Shop Tires";
  const ctaHref = slide?.cta_href ?? "/shop";
  const image = slide?.image_url ?? heroFallback;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    let q = "";
    if (tab === "vehicle") {
      q = [make, model, year].filter(Boolean).join(" ");
    } else if (tab === "size") {
      if (width && aspect && rim) q = `${width}/${aspect}R${rim}`;
      else q = [width, aspect, rim].filter(Boolean).join(" ");
    } else if (tab === "brand") {
      q = brand || searchText;
    }
    if (!q) {
      window.location.href = "/shop";
      return;
    }
    window.location.href = `/shop?q=${encodeURIComponent(q)}`;
  }

  return (
    <section className="relative min-h-[480px] sm:min-h-[580px] md:h-[720px] overflow-hidden flex items-center py-12 sm:py-0">
      {/* Background image with fade transition */}
      <div className="absolute inset-0 z-0">
        <img
          key={image}
          src={image}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: transitioning ? 0 : 1, transition: "opacity 0.35s ease" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-onyx via-onyx/80 to-onyx/30 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Slide navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 size-9 sm:size-11 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-racing-red hover:border-racing-red transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 size-9 sm:size-11 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-racing-red hover:border-racing-red transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </button>
        </>
      )}

      {/* Slide dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-[190px] sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-racing-red"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-racing-red font-bold mb-4 sm:mb-6 border border-racing-red/30 px-3 py-1 rounded-full">
          North American Distribution
        </span>
        <h1
          className="font-display text-4xl sm:text-5xl md:text-7xl uppercase leading-[0.95] max-w-xs sm:max-w-xl md:max-w-3xl"
          style={{ opacity: transitioning ? 0 : 1, transition: "opacity 0.3s ease", transitionDelay: transitioning ? "0s" : "0.05s" }}
        >
          {headline}
        </h1>
        <p
          className="text-silver/60 text-sm sm:text-base md:text-lg max-w-sm sm:max-w-md mt-4 sm:mt-6 leading-relaxed"
          style={{ opacity: transitioning ? 0 : 1, transition: "opacity 0.3s ease", transitionDelay: transitioning ? "0s" : "0.1s" }}
        >
          {subheadline}
        </p>

        <div className="mt-6 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
          <a
            href={ctaHref}
            className="group bg-racing-red px-5 sm:px-7 py-3 sm:py-4 rounded-sm font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover-glow"
          >
            {ctaLabel}
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/financing"
            className="px-5 sm:px-7 py-3 sm:py-4 rounded-sm font-bold uppercase tracking-widest text-xs border border-border hover:bg-secondary transition-colors"
          >
            Get Approved
          </a>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-8 sm:mt-12 bg-onyx/95 border border-border rounded-xl shadow-card max-w-3xl">
          <div className="flex border-b border-border">
            {(["vehicle", "size", "brand"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                  tab === t
                    ? "text-foreground border-b-2 border-racing-red"
                    : "text-silver/40 hover:text-silver/70"
                }`}
              >
                By {t}
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-4">
            {tab === "vehicle" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <select value={make} onChange={(e) => setMake(e.target.value)} className="search-sel col-span-1">
                  <option value="">Make</option>
                  {MAKES.map((m) => <option key={m}>{m}</option>)}
                </select>
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Model"
                  className="search-sel col-span-1"
                />
                <select value={year} onChange={(e) => setYear(e.target.value)} className="search-sel col-span-1">
                  <option value="">Year</option>
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
                <button type="submit" className="search-btn">
                  <Search className="size-3.5" /> Find
                </button>
              </div>
            )}

            {tab === "size" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <select value={width} onChange={(e) => setWidth(e.target.value)} className="search-sel">
                  <option value="">Width</option>
                  {TIRE_WIDTHS.map((w) => <option key={w}>{w}</option>)}
                </select>
                <select value={aspect} onChange={(e) => setAspect(e.target.value)} className="search-sel">
                  <option value="">Aspect</option>
                  {ASPECT_RATIOS.map((a) => <option key={a}>{a}</option>)}
                </select>
                <select value={rim} onChange={(e) => setRim(e.target.value)} className="search-sel">
                  <option value="">Rim (in)</option>
                  {RIM_SIZES.map((r) => <option key={r}>{r}"</option>)}
                </select>
                <button type="submit" className="search-btn">
                  <Search className="size-3.5" /> Find
                </button>
              </div>
            )}

            {tab === "brand" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <select value={brand} onChange={(e) => setBrand(e.target.value)} className="search-sel col-span-1">
                  <option value="">All Brands</option>
                  {TIRE_BRANDS.map((b) => <option key={b}>{b}</option>)}
                </select>
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Model or keyword…"
                  className="search-sel col-span-1 sm:col-span-2"
                />
                <button type="submit" className="search-btn">
                  <Search className="size-3.5" /> Find
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      <style>{`
        .search-sel {
          background: rgba(10,11,13,0.8);
          border: 1px solid var(--color-border, #222426);
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 13px;
          color: rgba(220,220,228,0.8);
          outline: none;
          appearance: none;
          cursor: pointer;
        }
        .search-sel:focus { border-color: #dc2626; }
        .search-sel::placeholder { color: rgba(160,160,168,0.4); }
        .search-btn {
          background: var(--color-foreground, #f0f0f2);
          color: var(--color-background, #0a0b0d);
          border: none;
          border-radius: 6px;
          padding: 10px 16px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.2s;
        }
        .search-btn:hover { background: #dc2626; color: #fff; }
      `}</style>
    </section>
  );
}
