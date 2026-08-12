"use client";

import { create } from "zustand";

export type View =
  | { name: "home" }
  | { name: "shop"; category?: string; q?: string }
  | { name: "product"; id: string }
  | { name: "checkout" }
  | { name: "account" }
  | { name: "admin" };

type UIState = {
  view: View;
  cartOpen: boolean;
  authOpen: boolean;
  authTab: "login" | "signup";
  navigate: (v: View) => void;
  setCartOpen: (v: boolean) => void;
  setAuthOpen: (v: boolean, tab?: "login" | "signup") => void;
  setAuthTab: (tab: "login" | "signup") => void;
};

export const useUI = create<UIState>((set) => ({
  view: { name: "home" },
  cartOpen: false,
  authOpen: false,
  authTab: "login",
  navigate: (v) => {
    set({ view: v });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  },
  setCartOpen: (v) => set({ cartOpen: v }),
  setAuthOpen: (v, tab) => set({ authOpen: v, authTab: tab ?? "login" }),
  setAuthTab: (tab) => set({ authTab: tab }),
}));
