export const metadata = { title: "Offline · Nihongo Reviewer" };

export default function OfflinePage() {
  return (
    <div className="pt-16 text-center">
      <div className="text-6xl" lang="ja">📴</div>
      <h1 className="mt-4 text-2xl font-bold">You&apos;re offline</h1>
      <p className="mt-2 text-slate-600">This page hasn&apos;t been saved yet. Pages you&apos;ve already opened still work.</p>
    </div>
  );
}

