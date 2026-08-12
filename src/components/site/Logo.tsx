"use client";

import { useUI } from "@/lib/ui-store";

export function Logo({ size = 32, withText = true }: { size?: number; withText?: boolean }) {
  const navigate = useUI((s) => s.navigate);
  return (
    <button
      onClick={() => navigate({ name: "home" })}
      className="flex items-center gap-2.5 group cursor-pointer"
      aria-label="Life Hive home"
    >
      <span className="relative inline-block transition-transform group-hover:scale-105" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.35)]">
          <defs>
            <linearGradient id="lh-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fbbf24" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path d="M32 2 L57 16 V48 L32 62 L7 48 V16 Z" fill="#0a0a0f" stroke="url(#lh-grad)" strokeWidth="2.5" />
          <path d="M32 14 L44 21 V35 L32 42 L20 35 V21 Z" fill="none" stroke="url(#lh-grad)" strokeWidth="1.6" opacity="0.65" />
          <path d="M32 24 L38 27.5 V34.5 L32 38 L26 34.5 V27.5 Z" fill="url(#lh-grad)" />
          <path d="M22 22 V42 H32" stroke="#0a0a0f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M40 22 V42 M40 32 H46" stroke="url(#lh-grad)" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.9" />
        </svg>
      </span>
      {withText && (
        <span className="font-display text-xl sm:text-2xl font-bold tracking-tight leading-none">
          <span className="text-foreground">Life</span>
          <span className="text-hive"> Hive</span>
        </span>
      )}
    </button>
  );
}
