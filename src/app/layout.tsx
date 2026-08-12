import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Life Hive — Everything is Here",
  description:
    "Life Hive is your home for everything — electronics, fashion, home goods, beauty, sports and more. Curated quality, transparent pricing, delivered worldwide.",
  keywords: ["Life Hive", "ecommerce", "online shopping", "electronics", "fashion", "home goods"],
  authors: [{ name: "Life Hive" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Life Hive — Everything is Here",
    description: "Your hive for everything you need. Shop electronics, fashion, home, beauty and more.",
    siteName: "Life Hive",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Hive — Everything is Here",
    description: "Your hive for everything you need.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
