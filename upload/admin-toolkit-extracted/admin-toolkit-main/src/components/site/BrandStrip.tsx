const BRANDS = [
  "MICHELIN",
  "BRIDGESTONE",
  "PIRELLI",
  "GOODYEAR",
  "CONTINENTAL",
  "YOKOHAMA",
];

export function BrandStrip() {
  return (
    <section className="border-y border-border bg-onyx/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-wrap justify-center sm:justify-between items-center gap-x-6 sm:gap-x-10 gap-y-4 sm:gap-y-5">
        {BRANDS.map((b) => (
          <span
            key={b}
            className="font-display text-xl sm:text-2xl tracking-[0.15em] text-silver/30 hover:text-silver/80 transition-colors cursor-pointer"
          >
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}
