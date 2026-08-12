export type Region = {
  code: string;
  label: string;
  flag: string;
  currency: string;
  symbol: string;
  taxRate: number;
};

export const REGIONS: Region[] = [
  { code: "US", label: "United States", flag: "🇺🇸", currency: "USD", symbol: "$", taxRate: 0.08 },
  { code: "CA", label: "Canada",        flag: "🇨🇦", currency: "CAD", symbol: "$", taxRate: 0.13 },
  { code: "UK", label: "United Kingdom",flag: "🇬🇧", currency: "GBP", symbol: "£", taxRate: 0.20 },
  { code: "AU", label: "Australia",     flag: "🇦🇺", currency: "AUD", symbol: "$", taxRate: 0.10 },
  { code: "EU", label: "Europe (EU)",   flag: "🇪🇺", currency: "EUR", symbol: "€", taxRate: 0.21 },
  { code: "IN", label: "India",         flag: "🇮🇳", currency: "INR", symbol: "₹", taxRate: 0.18 },
  { code: "AE", label: "UAE",           flag: "🇦🇪", currency: "AED", symbol: "د.إ", taxRate: 0.05 },
  { code: "SG", label: "Singapore",     flag: "🇸🇬", currency: "SGD", symbol: "$", taxRate: 0.08 },
  { code: "JP", label: "Japan",         flag: "🇯🇵", currency: "JPY", symbol: "¥", taxRate: 0.10 },
  { code: "BR", label: "Brazil",        flag: "🇧🇷", currency: "BRL", symbol: "R$", taxRate: 0.17 },
];

export const DEFAULT_REGION = REGIONS[0];

export function getRegion(code: string | null | undefined): Region {
  return REGIONS.find((r) => r.code === code) ?? DEFAULT_REGION;
}

export function formatPrice(amount: number, regionCode?: string): string {
  const r = getRegion(regionCode);
  if (r.currency === "JPY" || r.currency === "INR") {
    return `${r.symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${r.symbol}${amount.toFixed(2)}`;
}
