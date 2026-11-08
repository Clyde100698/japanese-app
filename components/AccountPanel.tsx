"use client";
import { useEffect, useState } from "react";
import { Cloud, CloudOff, RefreshCw, LogOut, Mail, CheckCircle2, ShieldCheck } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { getSyncStatus, onSyncStatus, syncNow, type SyncStatus } from "@/lib/sync";

const LABEL: Record<SyncStatus["state"], string> = {
  idle: "Not synced yet",
  syncing: "Syncing data with cloud…",
  ok: "Up to date with Supabase",
  offline: "Offline mode: changes will sync when online",
  "signed-out": "Sign in to synchronize progress across devices",
  "not-configured": "Supabase environment variables not configured. Progress is saved safely on this device.",
  error: "Could not reach Supabase. Your local progress is completely safe.",
};

export default function AccountPanel() {
  const sb = getSupabase();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus());

  useEffect(() => {
    const off = onSyncStatus(setStatus);
    return () => {
      off();
    };
  }, []);

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setUser(data.session?.user.email ?? null)).catch(() => {});
    const { data } = sb.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user.email ?? null);
      if (s) void syncNow();
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [sb]);

  const sendLink = async () => {
    if (!sb) return;
    setErr("");
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/account" },
    });
    if (error) setErr(error.message);
    else setSent(true);
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
        <Cloud className="size-4 text-blue-600 dark:text-blue-400" />
        <h2 className="font-heading font-bold text-sm">Cloud Account &amp; Sync</h2>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
        {status.state === "ok" ? (
          <CheckCircle2 className="size-3.5 text-emerald-500" />
        ) : status.state === "offline" ? (
          <CloudOff className="size-3.5 text-amber-500" />
        ) : (
          <RefreshCw className={`size-3.5 ${status.state === "syncing" ? "animate-spin text-blue-500" : ""}`} />
        )}
        <span>{LABEL[status.state]}</span>
      </div>

      {!sb ? null : user ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Signed in as <b>{user}</b></span>
          </div>
          <button
            type="button"
            onClick={() => void syncNow()}
            className="flex min-h-12 items-center gap-1.5 rounded-full bg-blue-600 px-4 text-xs font-bold text-white shadow-sm active:bg-blue-700 dark:bg-blue-500"
          >
            <RefreshCw className="size-3.5" />
            <span>Sync Now</span>
          </button>
          <button
            type="button"
            onClick={() => void sb.auth.signOut()}
            className="flex min-h-12 items-center gap-1.5 rounded-full bg-slate-100 px-4 text-xs font-bold text-slate-700 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      ) : sent ? (
        <p className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          Check your email! Tap the magic link to complete sign-in.
        </p>
      ) : (
        <div className="mt-3">
          <div className="flex gap-2">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Pre-created account email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-12 flex-1 rounded-xl border border-slate-300 px-3.5 text-xs text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => void sendLink()}
              disabled={!email.includes("@")}
              className="flex min-h-12 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-sm disabled:opacity-40 active:bg-blue-700 dark:bg-blue-500"
            >
              <Mail className="size-3.5" />
              <span>Email Link</span>
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            For maximum privacy, sign in with the single pre-created user authorized in your Supabase dashboard.
          </p>
        </div>
      )}
      {err && <p className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400">{err}</p>}
    </section>
  );
}
