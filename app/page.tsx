import HomeGameMap from "@/components/game/HomeGameMap";
import Link from "next/link";

export const metadata = {
  title: "Nihongo Quest · Japanese Learning PWA",
  description: "Learn Japanese from Hiragana through JLPT N1 with cute mascot Aoi. All tap & voice based.",
};

export default function Home() {
  return (
    <div>
      <HomeGameMap />

      <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <Link href="/credits" className="underline hover:text-slate-700 dark:hover:text-slate-200">
          Credits &amp; Open Data Licenses
        </Link>
      </p>
    </div>
  );
}
