import SpeakPractice from "@/components/SpeakPractice";

export const metadata = { title: "Speak · Nihongo Reviewer" };

export default function SpeakPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Speak</h1>
      <p className="mb-4 text-sm text-slate-600">Listen, then say it out loud. Works best in Chrome or Safari.</p>
      <SpeakPractice />
    </div>
  );
}

