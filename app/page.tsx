import Link from "next/link";
import LearningPath from "@/components/LearningPath";

export default function Home() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-black text-slate-900">
          <span lang="ja">こんにちは!</span> 👋
        </h1>
        <p className="text-sm text-slate-600">Tap to learn. Tap to review. No Japanese typing needed.</p>
      </div>

      {/* Quick Launch Cards */}
      <div className="mb-5 grid grid-cols-2 gap-2.5">
        <Link
          href="/review"
          className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 p-3.5 text-white shadow-sm active:opacity-90"
        >
          <span className="text-2xl">🔁</span>
          <div className="mt-2">
            <span className="block text-sm font-bold">Daily Review</span>
            <span className="block text-[11px] text-rose-100">Spaced repetition queue</span>
          </div>
        </Link>

        <Link
          href="/quiz"
          className="flex flex-col justify-between rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200 active:bg-slate-50"
        >
          <span className="text-2xl">🎮</span>
          <div className="mt-2">
            <span className="block text-sm font-bold text-slate-800">Tap Quizzes</span>
            <span className="block text-[11px] text-slate-500">Speed, matching &amp; build</span>
          </div>
        </Link>

        <Link
          href="/speak"
          className="flex flex-col justify-between rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200 active:bg-slate-50"
        >
          <span className="text-2xl">🎤</span>
          <div className="mt-2">
            <span className="block text-sm font-bold text-slate-800">Voice Practice</span>
            <span className="block text-[11px] text-slate-500">Speaking &amp; recognition</span>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="flex flex-col justify-between rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200 active:bg-slate-50"
        >
          <span className="text-2xl">📊</span>
          <div className="mt-2">
            <span className="block text-sm font-bold text-slate-800">Dashboard</span>
            <span className="block text-[11px] text-slate-500">Weak spots, streak &amp; badges</span>
          </div>
        </Link>
      </div>

      {/* Progressive Curriculum */}
      <LearningPath />

      <p className="mt-8 text-center text-xs text-slate-500">
        <Link href="/credits" className="underline hover:text-slate-700">
          Credits &amp; Open Data Licenses
        </Link>
      </p>
    </div>
  );
}
