# Nihongo Reviewer (日本語レビューアー)

A mobile-first Progressive Web App (PWA) designed as an interactive reviewer for learning Japanese from Hiragana & Katakana all the way through JLPT N1.

Built for learners who cannot type or write Japanese on mobile devices—**every single input is tap-based or voice-based**. Completely free to build, self-host, and run indefinitely.

---

## 🌟 Key Features

1. **Learn Mode**:
   - Interactive Hiragana & Katakana syllabary charts (Basic, Voiced, Combos, and Special characters).
   - Tap-to-hear native Japanese audio synthesis (`ja-JP`).
   - Stroke-by-stroke animated stroke order using KanjiVG vector paths.
   - Hand-curated visual mnemonics and confusable character alerts (e.g., シ vs ツ, ソ vs ン).
   - Optional finger tracing on HTML5 canvas with real-time coverage evaluation.

2. **SM-2 Spaced Repetition (SRS) Reviewer**:
   - Flashcard review engine utilizing the SuperMemo SM-2 algorithm.
   - 4-button grading: *Again* (10-min learning step), *Hard* (1.2× interval), *Good* (interval × ease), and *Easy* (bonus ease & interval).
   - Dynamic daily queue with adjustable daily new-card limits.
   - Automatic audio playback and optional furigana toggling.

3. **Tap-Only Quizzes (No Typing Needed)**:
   - **Multiple Choice**: Rapid 10-question rounds with plausible distractors.
   - **Matching Game**: Pair Japanese characters/words with English definitions.
   - **Build a Sentence**: Tap Japanese grammatical fragments in correct sequence.
   - **Listening Quiz**: Listen to Japanese speech and identify the meaning.
   - **Speed Round**: 60-second frenzy with streak multiplier bonuses.

4. **Speech Recognition & Voice Practice**:
   - Web Speech API integration (`SpeechRecognition`) for Japanese pronunciation practice.
   - Real-time Levenshtein edit-distance and phonetic similarity scoring.
   - Graceful fallback for browsers without speech recognition support (listen, self-grade).

5. **Gamification & Progress Dashboard**:
   - Real-time review streak tracking (current & all-time longest).
   - Total XP calculation with dynamic level progression.
   - Mastery breakdowns per JLPT level (Mastered, Learning, Unseen).
   - Weak spot detection highlighting high-lapse and low-ease cards.
   - Milestone badges (First Steps, Fire Starter, Kana Master, Centurion, XP Master).

6. **Structured Learning Path & Placement Test**:
   - Progressive roadmap: Hiragana → Katakana → N5 Vocab → N5 Grammar → N5 Kanji → N4 → N3 → N2 → N1.
   - 15-question adaptive placement test allowing learners with prior knowledge to skip ahead.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Offline & PWA**: Serwist Service Worker with cache-first runtime caching for static study data
- **Local Storage**: IndexedDB (via `idb`) for instant offline-first writes
- **Backend / Sync**: Supabase (Free Tier) with PostgreSQL & Row Level Security (RLS)
- **Data Bundles**: JMdict, KANJIDIC2, KanjiVG, and Tatoeba transformed into bundled static JSON
- **Testing**: Vitest with unit tests for SM-2, speech scoring, quiz generation, and data transformations

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+ (Node 22 or 24 recommended)
- npm

### 1. Clone & Install Dependencies
```bash
git clone <repo-url> nihongo-app
cd nihongo-app
npm install
```

### 2. Build the Static Study Datasets
Run the automated data pipeline to download open-source dictionaries and compile study bundles:
```bash
npm run build:data
```
This produces:
- `public/data/kana.json` & `public/data/kana-strokes.json`
- `public/data/particles.json`, `public/data/phrases.json`, `public/data/grammar.json`
- `public/data/words-n5.json` through `words-n1.json` (7,600+ JMdict words)
- `public/data/kanji-n5.json` through `kanji-n1.json` & `kanji-strokes.json` (2,136 jōyō kanji)
- `public/data/sentences.json` (4,000 Tatoeba sentence pairs)

Generate PWA launcher icons:
```bash
npm run build:icons
```

### 3. Run Unit Tests
```bash
npm test
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser (use mobile device emulation in DevTools for best experience).

---

## ☁️ Supabase Setup & SQL Migrations

The app is **100% functional without Supabase** (storing progress in IndexedDB). To enable multi-device cloud synchronization:

### 1. Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase dashboard, open the **SQL Editor**.
3. Open `supabase/migrations/0001_init.sql` from this repository, paste its contents into the SQL Editor, and click **Run**.

This migration creates:
- `profiles`: user metadata linked to `auth.users`.
- `card_states`: spaced repetition states (`ease`, `interval_days`, `reps`, `lapses`, `due_at`, `phase`, `updated_at`).
- `review_logs`: append-only logs for review history.
- `daily_stats`: daily review totals, new cards, accuracy, and XP.
- `settings`: synced user preferences.
- **Row Level Security (RLS)**: strict policies ensuring users can only read and write their own data.
- **Last-Write-Wins (LWW) Triggers**: database triggers that automatically prevent stale writes from overwriting newer timestamps.

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials from Supabase **Project Settings → API**:
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 📦 Deploy to Vercel (Hobby Tier - Free)

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Framework preset will automatically detect **Next.js**.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**.
7. Once deployed, open the URL on your mobile browser (Safari on iOS or Chrome on Android) and tap **Add to Home Screen** / **Install App** to run it as a standalone offline PWA!

---

## 📜 Open Data Sources & Licensing

- **KanjiVG**: Stroke-order vector graphics © Ulrich Apel, licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
- **JMdict / KANJIDIC2**: Japanese-English dictionary datasets © Electronic Dictionary Research and Development Group (EDRDG), licensed under [CC BY-SA 4.0](https://www.edrdg.org/edrdg/licence.html).
- **Tatoeba**: Japanese-English example sentence pairs by Tatoeba contributors, licensed under [CC BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/).
- **JLPT Lists**: Level assignments based on Jonathan Waller's lists ([tanos.co.uk](https://www.tanos.co.uk/jlpt/)), licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
- **Original Content**: Mnemonics, grammar explanations, situational phrases, and particles authored under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- See the in-app `/credits` route for full legal disclosures.
