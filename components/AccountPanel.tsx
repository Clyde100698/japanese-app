"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { getSyncStatus, onSyncStatus, syncNow, type SyncStatus } from "@/lib/sync";

const LABEL: Record<SyncStatus["state"], string> = {
  idle: "Not synced yet",
  syncing: "Syncing…",
  ok: "Up to date",
  offline: "Offline: will sync when you're back online",
  "signed-out": "Sign in to back up your progress",
  "not-configured": "Cloud sync isn't set up for this install. Progress is saved on this device.",
  error: "Couldn't reach the server. Your progress is safe on this device.",
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
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + "/account" } });
    if (error) setErr(error.message);
    else setSent(true);
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h2 className="font-semibold">Account &amp; sync</h2>
      <p className="mt-1 text-sm text-slate-600">{LABEL[status.state]}{status.state === "error" ? ` (${status.message})` : ""}</p>
      {!sb ? null : user ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm">Signed in as <b>{user}</b></span>
          <button onClick={() => void syncNow()} className="min-h-11 rounded-full bg-rose-600 px-4 text-sm font-semibold text-white">Sync now</button>
          <button onClick={() => void sb.auth.signOut()} className="min-h-11 rounded-full bg-slate-100 px-4 text-sm">Sign out</button>
        </div>
      ) : sent ? (
        <p className="mt-3 text-sm text-emerald-700">Check your email and tap the sign-in link.</p>
      ) : (
        <div className="mt-3 flex gap-2">
          <input
            type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-11 flex-1 rounded-xl border border-slate-300 px-3"
          />
          <button onClick={() => void sendLink()} disabled={!email.includes("@")} className="min-h-11 rounded-full bg-rose-600 px-4 text-sm font-semibold text-white disabled:opacity-40">Email link</button>
        </div>
      )}
      {err && <p className="mt-2 text-sm text-rose-700">{err}</p>}
    </section>
  );
}

