"use client";

import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Phone, Globe, ShieldCheck, Sparkles } from "lucide-react";
import { useUI } from "@/lib/ui-store";
import { useAuth } from "@/lib/auth-store";
import { REGIONS } from "@/lib/regions";
import { toast } from "sonner";

export function AuthDialog() {
  const { authOpen, authTab, setAuthOpen, setAuthTab } = useUI();
  const { fetchMe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("US");

  useEffect(() => {
    if (!authOpen) {
      setError(null);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRegion("US");
    }
  }, [authOpen]);

  if (!authOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = authTab === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const payload =
        authTab === "signup"
          ? { name, email, password, phone: phone || null, region }
          : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
        return;
      }
      await fetchMe();
      toast.success(authTab === "signup" ? "Welcome to Life Hive!" : "Welcome back!");
      setAuthOpen(false);
    } catch (e) {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={() => setAuthOpen(false)}
      />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header with logo */}
        <div className="relative px-6 pt-7 pb-5 border-b border-border bg-gradient-to-br from-hive/10 via-transparent to-transparent">
          <button
            onClick={() => setAuthOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 64 64" className="size-11">
              <defs>
                <linearGradient id="auth-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fbbf24" />
                  <stop offset="1" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <path d="M32 2 L57 16 V48 L32 62 L7 48 V16 Z" fill="#0a0a0f" stroke="url(#auth-grad)" strokeWidth="2.5" />
              <path d="M32 14 L44 21 V35 L32 42 L20 35 V21 Z" fill="none" stroke="url(#auth-grad)" strokeWidth="1.6" opacity="0.65" />
              <path d="M32 24 L38 27.5 V34.5 L32 38 L26 34.5 V27.5 Z" fill="url(#auth-grad)" />
            </svg>
            <div>
              <h2 className="font-display text-xl font-bold leading-tight">
                {authTab === "signup" ? "Join Life Hive" : "Welcome back"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {authTab === "signup" ? "Everything you need, in one hive" : "Sign in to your account"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab toggle */}
        <div className="grid grid-cols-2 border-b border-border">
          <button
            onClick={() => { setAuthTab("login"); setError(null); }}
            className={`py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              authTab === "login" ? "text-hive border-b-2 border-hive bg-hive/5" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthTab("signup"); setError(null); }}
            className={`py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              authTab === "signup" ? "text-hive border-b-2 border-hive bg-hive/5" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {authTab === "signup" && (
            <Field label="Full Name" icon={<User className="size-4" />}>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="auth-input"
              />
            </Field>
          )}

          <Field label="Email" icon={<Mail className="size-4" />}>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="auth-input"
            />
          </Field>

          <Field label="Password" icon={<Lock className="size-4" />}>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="auth-input"
            />
          </Field>

          {authTab === "signup" && (
            <>
              <Field label="Phone (optional)" icon={<Phone className="size-4" />}>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                  className="auth-input"
                />
              </Field>

              <Field label="Select your region" icon={<Globe className="size-4" />}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-0.5">
                  {REGIONS.map((r) => (
                    <button
                      type="button"
                      key={r.code}
                      onClick={() => setRegion(r.code)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        region === r.code
                          ? "border-hive bg-hive/10 text-hive"
                          : "border-border bg-background hover:border-hive/40 text-foreground/80"
                      }`}
                    >
                      <span className="text-base leading-none">{r.flag}</span>
                      <div className="text-left min-w-0">
                        <p className="truncate">{r.label}</p>
                        <p className="text-[9px] text-muted-foreground uppercase">{r.currency}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hive text-onyx py-3 rounded-full font-bold text-sm uppercase tracking-wider hover-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              "Please wait…"
            ) : authTab === "signup" ? (
              <>
                <Sparkles className="size-4" />
                Create Account
              </>
            ) : (
              <>
                <ShieldCheck className="size-4" />
                Sign In
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-muted-foreground">
            {authTab === "signup" ? (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => setAuthTab("login")} className="text-hive font-bold hover:underline">
                  Sign in
                </button>
              </>
            ) : (
              <>
                New to Life Hive?{" "}
                <button type="button" onClick={() => setAuthTab("signup")} className="text-hive font-bold hover:underline">
                  Create an account
                </button>
              </>
            )}
          </p>
        </form>

        <style>{`
          .auth-input {
            width: 100%;
            background: var(--background);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 10px 12px 10px 36px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
          }
          .auth-input:focus { border-color: var(--hive); }
          .auth-input::placeholder { color: var(--muted-foreground); opacity: 0.6; }
        `}</style>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 block">
        {label}
      </span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
    </label>
  );
}
