"use client";

import { useEffect } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { HomeContent } from "@/components/site/HomeContent";
import { ShopView } from "@/components/site/ShopView";
import { ProductView } from "@/components/site/ProductView";
import { CheckoutView } from "@/components/site/CheckoutView";
import { AccountView } from "@/components/site/AccountView";
import { AdminView } from "@/components/admin/AdminView";
import { CartDrawer } from "@/components/site/CartDrawer";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useUI } from "@/lib/ui-store";
import { useAuth } from "@/lib/auth-store";
import { Toaster } from "sonner";

export default function Home() {
  const { view } = useUI();
  const { fetchMe, user, loading } = useAuth();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // Guard: if going to account/admin without auth, send home
  useEffect(() => {
    if (!loading && !user && (view.name === "account" || view.name === "admin")) {
      useUI.getState().setAuthOpen(true, "login");
    }
  }, [loading, user, view]);

  const isAdminView = view.name === "admin";
  const isCheckoutView = view.name === "checkout";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isAdminView && <Header />}

      <main className="flex-1">
        {view.name === "home" && (
          <>
            <Hero />
            <HomeContent />
          </>
        )}
        {view.name === "shop" && <ShopView category={view.category} q={view.q} />}
        {view.name === "product" && <ProductView id={view.id} />}
        {view.name === "checkout" && <CheckoutView />}
        {view.name === "account" && <AccountView />}
        {view.name === "admin" && <AdminView />}
      </main>

      {!isAdminView && !isCheckoutView && <Footer />}

      <CartDrawer />
      <AuthDialog />
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#13131a",
            border: "1px solid #232330",
            color: "#f5f5f7",
          },
        }}
      />
    </div>
  );
}
