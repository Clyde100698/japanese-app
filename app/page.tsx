import Link from "next/link";
import { RotateCcw, Gamepad2, Mic, TrendingUp, MessageSquare, BookOpen, ArrowRight } from "lucide-react";
import LearningPath from "@/components/LearningPath";

export default function Home() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="font-heading text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          <span lang="ja">こんにちは!</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Tap to learn. Tap to review. No Japanese typing needed.
        </p>
      </div>

      {/* Quick Launch Cards (min-h-12 / 48px+ touch targets, 16px rounded-2xl) */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <Link
          href="/review"
          className="flex min-h-[5.5rem] flex-col justify-between rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-4 text-white shadow-sm transition-transform active:scale-[0.98] dark:from-blue-600 dark:to-indigo-700"
        >
          <RotateCcw className="size-6 text-blue-200" />
          <div>
            <span className="block font-heading text-sm font-bold">Daily Review</span>
            <span className="block text-[11px] text-blue-100">SRS flashcards</span>
          </div>
        </Link>

        <Link
          href="/conversation"
          className="flex min-h-[5.5rem] flex-col justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-transform active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
        >
          <MessageSquare className="size-6 text-blue-600 dark:text-blue-400" />
          <div>
            <span className="block font-heading text-sm font-bold text-slate-900 dark:text-white">Conversation</span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">40+ branch scenarios</span>
          </div>
        </Link>

        <Link
          href="/quiz"
          className="flex min-h-[5.5rem] flex-col justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-transform active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
        >
          <Gamepad2 className="size-6 text-blue-600 dark:text-blue-400" />
          <div>
            <span className="block font-heading text-sm font-bold text-slate-900 dark:text-white">Tap Quizzes</span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">Speed &amp; matching</span>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="flex min-h-[5.5rem] flex-col justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-transform active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
        >
          <TrendingUp className="size-6 text-blue-600 dark:text-blue-400" />
          <div>
            <span className="block font-heading text-sm font-bold text-slate-900 dark:text-white">Progress</span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400">Streak, XP &amp; badges</span>
          </div>
        </Link>
      </div>

      {/* Progressive Curriculum */}
      <LearningPath />

      <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <Link href="/credits" className="underline hover:text-slate-700 dark:hover:text-slate-200">
          Credits &amp; Open Data Licenses
        </Link>
      </p>
    </div>
  );
}
