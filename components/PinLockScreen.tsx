"use client";
import { useEffect, useState } from "react";
import { Lock, Delete, ShieldAlert } from "lucide-react";
import {
  getCooldownRemaining,
  isAppLocked,
  onLockStateChange,
  recordFailedAttempt,
  touchActivity,
  verifyPin,
  MAX_ATTEMPTS,
} from "@/lib/auth";
import { useSettings } from "@/lib/settings";

export default function PinLockScreen() {
  const [settings] = useSettings();
  const autoLock = (settings as any).autoLockMinutes ?? 5; // default 5 min

  const [locked, setLocked] = useState<boolean>(true);
  const [pin, setPin] = useState<string>("");
  const [shaking, setShaking] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [cooldown, setCooldown] = useState<number>(0);

  // Check lock state & cooldown on mount and on visibility change
  useEffect(() => {
    const check = () => {
      setLocked(isAppLocked(autoLock));
      setCooldown(getCooldownRemaining());
    };
    check();

    const off = onLockStateChange(setLocked);
    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
      else touchActivity();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      off();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [autoLock]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      const remaining = getCooldownRemaining();
      setCooldown(remaining);
      if (remaining <= 0) setErrorMsg("");
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Touch activity on user click/tap when unlocked
  useEffect(() => {
    if (!locked) {
      const update = () => touchActivity();
      window.addEventListener("pointerdown", update);
      window.addEventListener("keydown", update);
      return () => {
        window.removeEventListener("pointerdown", update);
        window.removeEventListener("keydown", update);
      };
    }
  }, [locked]);

  const handleDigit = async (d: string) => {
    if (cooldown > 0 || pin.length >= 6) return;
    const nextPin = pin + d;
    setPin(nextPin);
    setErrorMsg("");

    if (nextPin.length === 6) {
      const ok = await verifyPin(nextPin);
      if (ok) {
        setPin("");
        setLocked(false);
      } else {
        setShaking(true);
        const { remainingAttempts, cooldownSeconds } = recordFailedAttempt();
        setTimeout(() => setShaking(false), 500);
        setPin("");
        if (cooldownSeconds > 0) {
          setCooldown(cooldownSeconds);
          setErrorMsg(`Too many wrong attempts. Locked for ${cooldownSeconds}s.`);
        } else {
          setErrorMsg(`Incorrect PIN. ${remainingAttempts} attempts remaining.`);
        }
      }
    }
  };

  const handleDelete = () => {
    if (cooldown > 0 || pin.length === 0) return;
    setPin((p) => p.slice(0, -1));
  };

  const handleClear = () => {
    if (cooldown > 0) return;
    setPin("");
    setErrorMsg("");
  };

  if (!locked) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-50/98 px-6 py-10 backdrop-blur-md dark:bg-[#090d16]/98">
      {/* Top Header */}
      <div className="flex flex-col items-center pt-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-3xl bg-blue-100 text-blue-600 shadow-sm dark:bg-blue-950/60 dark:text-blue-400">
          <Lock className="size-8" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Nihongo Reviewer
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your 6-digit PIN to access your study deck
        </p>
      </div>

      {/* 6-Digit Dots & Error Area */}
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center gap-4 py-4 ${
            shaking ? "animate-shake" : ""
          }`}
          aria-label={`${pin.length} of 6 digits entered`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`size-4 rounded-full transition-all duration-200 ${
                i < pin.length
                  ? "scale-110 bg-blue-600 dark:bg-blue-400 shadow-sm"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Error or Cooldown Notice */}
        <div className="h-6">
          {cooldown > 0 ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <ShieldAlert className="size-3.5" />
              <span>Too many attempts. Locked for {cooldown}s</span>
            </div>
          ) : errorMsg ? (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400" role="alert">
              {errorMsg}
            </p>
          ) : null}
        </div>
      </div>

      {/* Numeric Keypad (48px+ touch targets) */}
      <div className="w-full max-w-xs pb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              disabled={cooldown > 0}
              onClick={() => handleDigit(num)}
              className="flex size-16 items-center justify-center mx-auto rounded-full bg-white font-heading text-2xl font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 active:bg-blue-50 active:scale-95 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:active:bg-slate-700"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            disabled={cooldown > 0 || pin.length === 0}
            onClick={handleClear}
            className="flex size-16 items-center justify-center mx-auto rounded-full font-heading text-xs font-semibold text-slate-500 active:text-slate-700 disabled:opacity-20 dark:text-slate-400"
          >
            Clear
          </button>
          <button
            type="button"
            disabled={cooldown > 0}
            onClick={() => handleDigit("0")}
            className="flex size-16 items-center justify-center mx-auto rounded-full bg-white font-heading text-2xl font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 active:bg-blue-50 active:scale-95 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:active:bg-slate-700"
          >
            0
          </button>
          <button
            type="button"
            disabled={cooldown > 0 || pin.length === 0}
            onClick={handleDelete}
            aria-label="Delete last digit"
            className="flex size-16 items-center justify-center mx-auto rounded-full text-slate-600 active:text-slate-900 disabled:opacity-20 dark:text-slate-400 dark:active:text-white"
          >
            <Delete className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

