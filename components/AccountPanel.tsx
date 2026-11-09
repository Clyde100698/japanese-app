"use client";
import { useEffect, useState } from "react";
import {
  Cloud,
  CloudOff,
  RefreshCw,
  LogOut,
  Mail,
  Lock,
  User,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { getSyncStatus, onSyncStatus, syncNow, type SyncStatus } from "@/lib/sync";
import Button3D from "@/components/game/Button3D";
import Mascot from "@/components/mascot/Mascot";
import { playTapSound, playCorrectSound, playWrongSound } from "@/lib/sound";

const LABEL: Record<SyncStatus["state"], string> = {
  idle: "Not synced yet",
  syncing: "Syncing data with cloud…",
  ok: "Up to date with Supabase Cloud",
  offline: "Offline mode: local changes will sync automatically when online",
  "signed-out": "Playing as Guest. Sign in or register to sync across devices.",
  "not-configured": "Supabase credentials not configured. Progress is safely saved locally.",
  error: "Could not reach cloud. Your local progress is completely safe.",
};

type AuthTab = "register" | "login" | "otp";

export default function AccountPanel() {
  const sb = getSupabase();
  const [tab, setTab] = useState<AuthTab>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const off = onSyncStatus(setStatus);
    return () => {
      off();
    };
  }, []);

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) {
        setUser({
          id: u.id,
          email: u.email || "",
          name: (u.user_metadata?.name as string) || (u.email ? u.email.split("@")[0] : "Learner"),
        });
      } else {
        setUser(null);
      }
    }).catch(() => {});

    const { data } = sb.auth.onAuthStateChange((_e, s) => {
      const u = s?.user;
      if (u) {
        setUser({
          id: u.id,
          email: u.email || "",
          name: (u.user_metadata?.name as string) || (u.email ? u.email.split("@")[0] : "Learner"),
        });
        void syncNow();
      } else {
        setUser(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [sb]);

  // Register a new user
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb) return;
    setErr("");
    setMsg("");

    if (!email.includes("@")) {
      setErr("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    playTapSound();
    try {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim() || email.split("@")[0],
          },
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/account` : undefined,
        },
      });

      if (error) {
        playWrongSound();
        setErr(error.message);
      } else if (data.session) {
        playCorrectSound();
        setMsg("Account created and signed in! Syncing your progress...");
        await syncNow();
      } else {
        playCorrectSound();
        setMsg("Registration successful! Check your email to confirm your account, then log in.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Sign in existing user
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb) return;
    setErr("");
    setMsg("");

    if (!email.includes("@")) {
      setErr("Please enter your email.");
      return;
    }
    if (!password) {
      setErr("Please enter your password.");
      return;
    }

    setLoading(true);
    playTapSound();
    try {
      const { data, error } = await sb.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        playWrongSound();
        setErr(error.message);
      } else if (data.user) {
        playCorrectSound();
        setMsg("Signed in successfully! Loading your progress...");
        await syncNow();
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  // Sign in via Magic Link OTP
  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb) return;
    setErr("");
    setMsg("");

    if (!email.includes("@")) {
      setErr("Please enter your email.");
      return;
    }

    setLoading(true);
    playTapSound();
    try {
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/account" },
      });
      if (error) {
        playWrongSound();
        setErr(error.message);
      } else {
        playCorrectSound();
        setMsg("Magic sign-in link sent! Please check your email inbox.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Magic link failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!sb) return;
    playTapSound();
    await sb.auth.signOut();
    setUser(null);
    setMsg("Signed out. You are now playing in Guest mode.");
  };

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Cloud className="size-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-heading font-black text-base">User Account &amp; Progress Sync</h2>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
          {status.state === "ok" ? (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="size-3.5" />
              <span>Synced</span>
            </span>
          ) : status.state === "syncing" ? (
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full">
              <RefreshCw className="size-3.5 animate-spin" />
              <span>Syncing</span>
            </span>
          ) : status.state === "offline" ? (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full">
              <CloudOff className="size-3.5" />
              <span>Offline</span>
            </span>
          ) : null}
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {LABEL[status.state]}
      </p>

      {/* ========================================================================= */}
      {/* SIGNED-IN PROFILE VIEW */}
      {/* ========================================================================= */}
      {user ? (
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800/40 p-4 ring-1 ring-blue-100 dark:ring-slate-700 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-lg shadow-sm">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-sm text-slate-900 dark:text-white">
                  {user.name}
                </span>
                <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button3D
              variant="primary"
              size="sm"
              iconLeft={<RefreshCw className="size-3.5" />}
              onClick={() => void syncNow()}
            >
              Sync Now
            </Button3D>

            <Button3D
              variant="neutral"
              size="sm"
              iconLeft={<LogOut className="size-3.5" />}
              onClick={handleSignOut}
            >
              Sign Out
            </Button3D>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* AUTH TABS: REGISTER / LOGIN / GUEST */
        /* ========================================================================= */
        <div className="space-y-4 pt-1">
          {/* Sub Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => {
                setTab("register");
                setErr("");
                setMsg("");
              }}
              className={`py-2 text-xs font-black rounded-xl transition ${
                tab === "register"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Register (New)
            </button>

            <button
              type="button"
              onClick={() => {
                setTab("login");
                setErr("");
                setMsg("");
              }}
              className={`py-2 text-xs font-black rounded-xl transition ${
                tab === "login"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setTab("otp");
                setErr("");
                setMsg("");
              }}
              className={`py-2 text-xs font-black rounded-xl transition ${
                tab === "otp"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Magic Link
            </button>
          </div>

          {/* TAB 1: REGISTRATION */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Your Name (Optional)
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Learner Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-3.5 text-xs font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-3.5 text-xs font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Choose Password (min 6 characters)
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-10 text-xs font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <Button3D
                  variant="primary"
                  fullWidth
                  size="md"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create My Account"}
                </Button3D>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                Your progress is isolated to your own account with Supabase Row Level Security.
              </p>
            </form>
          )}

          {/* TAB 2: SIGN IN (PASSWORD) */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-3.5 text-xs font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-10 text-xs font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <Button3D
                  variant="primary"
                  fullWidth
                  size="md"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In & Load Progress"}
                </Button3D>
              </div>
            </form>
          )}

          {/* TAB 3: MAGIC LINK OTP */}
          {tab === "otp" && (
            <form onSubmit={handleOtp} className="space-y-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Account Email
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-3.5 text-xs font-semibold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-1">
                <Button3D
                  variant="primary"
                  fullWidth
                  size="md"
                  disabled={loading}
                >
                  {loading ? "Sending Link..." : "Send Magic Link"}
                </Button3D>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                We will email you a one-click sign in link.
              </p>
            </form>
          )}
        </div>
      )}

      {/* Messages */}
      {msg && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
          <span>{msg}</span>
        </div>
      )}

      {err && (
        <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-bold text-rose-800 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-800 flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0 text-rose-500" />
          <span>{err}</span>
        </div>
      )}
    </section>
  );
}
