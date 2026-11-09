import AccountPanel from "@/components/AccountPanel";
import Mascot from "@/components/mascot/Mascot";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Account & Cloud Sync · Nihongo Quest",
  description: "Register or log in to sync your Japanese learning progress across all your devices.",
};

export default function AccountPage() {
  return (
    <div className="space-y-4 pb-12">
      {/* Kawaii Mascot Intro Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 text-white shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Cloud Sync
            </span>
            <h1 className="text-xl font-black tracking-tight">
              User Registration &amp; Account
            </h1>
            <p className="text-xs text-blue-100 max-w-[240px] leading-relaxed">
              Register or sign in so you can access your own personalized progress from any device!
            </p>
          </div>

          <div className="shrink-0">
            <Mascot
              state="happy"
              size={85}
              speech={{ ja: "ログインしよう！", en: "Sync your progress!" }}
              bubblePlacement="left"
              interactive={true}
            />
          </div>
        </div>
      </div>

      <AccountPanel />
    </div>
  );
}
