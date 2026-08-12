import { Clock, ShieldCheck, Zap } from "lucide-react";

export function FinancingCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14 sm:pb-24">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-graphite via-onyx to-onyx p-6 sm:p-10 md:p-16">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-racing-red/20 blur-3xl pointer-events-none" />
        <div className="relative grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-racing-red font-bold">
              Financing
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mt-3">
              Drive today.<br />
              <span className="text-gradient-silver">Pay over time.</span>
            </h2>
            <p className="text-silver/60 mt-4 max-w-md text-sm sm:text-base">
              Instant credit application with flexible monthly plans. Admin usually responds within 24 hours.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              <a
                href="/financing"
                className="bg-racing-red px-5 sm:px-7 py-3 sm:py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover-glow"
              >
                Apply Now
              </a>
              <a
                href="/track-order"
                className="px-5 sm:px-7 py-3 sm:py-4 rounded-sm font-bold uppercase tracking-widest text-xs border border-border hover:bg-secondary transition-colors"
              >
                Track Application
              </a>
            </div>
          </div>
          <div className="grid gap-4">
            <Stat icon={<Clock className="size-4" />} title="24-hour response" desc="Average admin review time on financing applications." />
            <Stat icon={<ShieldCheck className="size-4" />} title="Secure submission" desc="Bank-grade encryption on all submitted documents." />
            <Stat icon={<Zap className="size-4" />} title="Flexible terms" desc="Plans starting as low as $18/mo with $0 down." />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-graphite/60 border border-border rounded-xl p-5 flex gap-4 items-start hover-glow">
      <div className="size-9 rounded-md bg-racing-red/10 border border-racing-red/30 text-racing-red grid place-items-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-silver/50 text-xs mt-1">{desc}</p>
      </div>
    </div>
  );
}
