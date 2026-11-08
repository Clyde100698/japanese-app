"use client";
import { getMeta, setMeta } from "./db";
import { getSupabase } from "./supabase";

export const MAX_ATTEMPTS = 5;
export const COOLDOWN_SECONDS = 60;

const STORAGE_UNLOCKED = "nihongo.auth.unlocked";
const STORAGE_LAST_ACTIVE = "nihongo.auth.last_active";
const STORAGE_FAILED_COUNT = "nihongo.auth.failed_count";
const STORAGE_COOLDOWN_UNTIL = "nihongo.auth.cooldown_until";

type LockListener = (locked: boolean) => void;
const listeners = new Set<LockListener>();

export function onLockStateChange(cb: LockListener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function notify(locked: boolean) {
  listeners.forEach((l) => l(locked));
}

/** Compute SHA-256 hex string of a PIN */
export async function hashPin(pin: string): Promise<string> {
  const enc = new TextEncoder().encode(pin);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Get the stored PIN hash (from IndexedDB cache or Supabase) */
export async function getStoredPinHash(): Promise<string | null> {
  // Check local IndexedDB meta first
  const local = await getMeta<string>("app_pin_hash");
  if (local) return local;

  // Check Supabase user profiles and settings
  const sb = getSupabase();
  if (sb) {
    try {
      const { data: sessionData } = await sb.auth.getSession();
      const uid = sessionData.session?.user.id;
      if (uid) {
        // 1. Check profile
        const { data: profile } = await sb.from("profiles").select("pin_hash").eq("id", uid).maybeSingle();
        if (profile?.pin_hash) {
          await setMeta("app_pin_hash", profile.pin_hash);
          return profile.pin_hash;
        }

        // 2. Check settings
        const { data: settings } = await sb.from("settings").select("pin_hash, data").eq("user_id", uid).maybeSingle();
        const remoteHash = (settings?.pin_hash || settings?.data?.pin_hash) as string | undefined;
        if (remoteHash) {
          await setMeta("app_pin_hash", remoteHash);
          return remoteHash;
        }
      }
    } catch {
      // Offline
    }
  }

  return null;
}

/** Save a new PIN hash locally and to Supabase */
export async function savePinHash(pin: string): Promise<void> {
  const hash = await hashPin(pin);
  await setMeta("app_pin_hash", hash);

  const sb = getSupabase();
  if (sb) {
    try {
      const { data: sessionData } = await sb.auth.getSession();
      const uid = sessionData.session?.user.id;
      if (uid) {
        // Try RPC first if available
        const { error: rpcErr } = await sb.rpc("set_user_pin", { new_pin: pin });
        if (rpcErr) {
          // Fallback to table update
          await sb.from("profiles").update({ pin_hash: hash, updated_at: new Date().toISOString() }).eq("id", uid);
          const { data: existing } = await sb.from("settings").select("data").eq("user_id", uid).maybeSingle();
          const currentData = existing?.data || {};
          await sb.from("settings").upsert(
            {
              user_id: uid,
              pin_hash: hash,
              data: { ...currentData, pin_hash: hash },
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          );
        }
      }
    } catch {
      // Offline - will sync or remain local
    }
  }
}

/** Check if the app is currently locked */
export function isAppLocked(autoLockMinutes = 5): boolean {
  if (typeof window === "undefined") return false;

  const unlocked = sessionStorage.getItem(STORAGE_UNLOCKED) === "true";
  if (!unlocked) return true;

  if (autoLockMinutes === -1) return false; // Never auto-lock

  const lastActiveStr = localStorage.getItem(STORAGE_LAST_ACTIVE);
  if (!lastActiveStr) return true;

  const lastActive = Number(lastActiveStr);
  const now = Date.now();
  const allowedInactivity = autoLockMinutes * 60 * 1000;

  if (now - lastActive > allowedInactivity) {
    sessionStorage.removeItem(STORAGE_UNLOCKED);
    return true;
  }

  return false;
}

/** Update the user's active timestamp */
export function touchActivity(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_LAST_ACTIVE, String(Date.now()));
}

/** Lock the session immediately */
export function lockSessionNow(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_UNLOCKED);
  notify(true);
}

/** Get remaining cooldown seconds, or 0 if not cooling down */
export function getCooldownRemaining(): number {
  if (typeof window === "undefined") return 0;
  const untilStr = localStorage.getItem(STORAGE_COOLDOWN_UNTIL);
  if (!untilStr) return 0;
  const remaining = Math.ceil((Number(untilStr) - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}

/** Record a failed attempt and initiate cooldown if reaching limit */
export function recordFailedAttempt(): { remainingAttempts: number; cooldownSeconds: number } {
  const current = Number(localStorage.getItem(STORAGE_FAILED_COUNT) || "0") + 1;
  localStorage.setItem(STORAGE_FAILED_COUNT, String(current));

  if (current >= MAX_ATTEMPTS) {
    const cooldownUntil = Date.now() + COOLDOWN_SECONDS * 1000;
    localStorage.setItem(STORAGE_COOLDOWN_UNTIL, String(cooldownUntil));
    localStorage.setItem(STORAGE_FAILED_COUNT, "0");
    return { remainingAttempts: 0, cooldownSeconds: COOLDOWN_SECONDS };
  }

  return { remainingAttempts: MAX_ATTEMPTS - current, cooldownSeconds: 0 };
}

/** Verify a 6-digit PIN. Returns true if match. */
export async function verifyPin(pin: string): Promise<boolean> {
  const storedHash = await getStoredPinHash();
  if (!storedHash) {
    // If no PIN set yet, any 6-digit PIN sets the initial PIN
    await savePinHash(pin);
    sessionStorage.setItem(STORAGE_UNLOCKED, "true");
    touchActivity();
    localStorage.removeItem(STORAGE_FAILED_COUNT);
    notify(false);
    return true;
  }

  const enteredHash = await hashPin(pin);
  if (enteredHash === storedHash) {
    sessionStorage.setItem(STORAGE_UNLOCKED, "true");
    touchActivity();
    localStorage.removeItem(STORAGE_FAILED_COUNT);
    localStorage.removeItem(STORAGE_COOLDOWN_UNTIL);
    notify(false);
    return true;
  }

  return false;
}
