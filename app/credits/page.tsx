export const metadata = { title: "Credits & Licenses · Nihongo Reviewer" };

interface Source {
  name: string;
  by: string;
  license: string;
  licenseUrl: string;
  url: string;
  use: string;
  status: string;
}

const SOURCES: Source[] = [
  {
    name: "KanjiVG",
    by: "Ulrich Apel and contributors",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    url: "https://kanjivg.tagaini.net/",
    use: "Stroke-order vector data for 177 kana characters and 2,136 jōyō kanji. Transformed into compact, animated SVG paths.",
    status: "Bundled & Active (kana-strokes.json & kanji-strokes.json)",
  },
  {
    name: "JMdict (via jmdict-simplified)",
    by: "Electronic Dictionary Research and Development Group (EDRDG); JSON conversion by scriptin",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://www.edrdg.org/edrdg/licence.html",
    url: "https://github.com/scriptin/jmdict-simplified",
    use: "Vocabulary database: 7,600+ words classified across JLPT N5 through N1 with kanji, kana, meanings, parts of speech, and commonality tags.",
    status: "Bundled & Active (words-n5..n1.json)",
  },
  {
    name: "KANJIDIC2",
    by: "EDRDG",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://www.edrdg.org/edrdg/licence.html",
    url: "https://www.edrdg.org/wiki/index.php/KANJIDIC_Project",
    use: "2,136 jōyō kanji character dictionary with onyomi, kunyomi, English glosses, stroke counts, and school grades.",
    status: "Bundled & Active (kanji-n5..n1.json)",
  },
  {
    name: "Tatoeba",
    by: "Tatoeba contributors",
    license: "CC BY 2.0 FR",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/fr/",
    url: "https://tatoeba.org/",
    use: "4,000 clean Japanese-English sentence pairs linked to JLPT vocabulary by headword, used in tap-to-build quizzes and examples.",
    status: "Bundled & Active (sentences.json)",
  },
  {
    name: "JLPT Vocabulary & Kanji Lists",
    by: "Jonathan Waller (tanos.co.uk), converted by Bluskyo",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    url: "https://github.com/Bluskyo/JLPT_Vocabulary",
    use: "JLPT level classifications (N5 through N1) mapped onto dictionary entries.",
    status: "Bundled & Active",
  },
  {
    name: "Original Curated Study Content",
    by: "Nihongo Reviewer",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    url: "/",
    use: "211 kana entries with original visual mnemonics, 19 grammar particles with full explanations, 160+ spoken situational phrases with romaji, and comprehensive grammar patterns for N5-N1 with 3 examples each.",
    status: "Hand-curated & Active (kana.json, particles.json, phrases.json, grammar.json)",
  },
];

const SOFTWARE = [
  "Next.js (App Router, MIT)",
  "React 19 (MIT)",
  "Tailwind CSS (MIT)",
  "Serwist Service Worker (MIT)",
  "idb (IndexedDB wrapper, ISC)",
  "Supabase Client (MIT)",
  "Vitest (MIT)",
  "fflate & unbzip2-stream (MIT)",
];

export default function CreditsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Credits &amp; Open Licenses</h1>
        <p className="mt-1 text-sm text-slate-600">
          Nihongo Reviewer is completely free and built on top of high quality open datasets and open source tools. We
          extend our deepest gratitude to the scholars, authors, and communities who made this data freely available.
        </p>
      </div>

      <ul className="space-y-3">
        {SOURCES.map((s) => (
          <li key={s.name} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-baseline justify-between">
              <h2 className="font-bold text-slate-900">
                <a className="underline hover:text-rose-600" href={s.url} target="_blank" rel="noreferrer">
                  {s.name}
                </a>
              </h2>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500">{s.by}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">{s.use}</p>
            <p className="mt-2 text-xs font-medium text-slate-600">
              License:{" "}
              <a className="underline text-rose-600" href={s.licenseUrl} target="_blank" rel="noreferrer">
                {s.license}
              </a>
            </p>
          </li>
        ))}
      </ul>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="font-bold text-slate-900">Open Source Software</h2>
        <p className="mt-1 text-xs text-slate-600">{SOFTWARE.join(" · ")}.</p>
      </section>
    </div>
  );
}
