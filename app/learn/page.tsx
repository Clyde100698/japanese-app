import KanaChart from "@/components/KanaChart";

export const metadata = { title: "Learn kana · Nihongo Reviewer" };

export default function LearnPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Learn kana</h1>
      <p className="mb-4 text-sm text-slate-600">Tap any character to hear it, see how to write it, and get a memory trick.</p>
      <KanaChart />
    </div>
  );
}

