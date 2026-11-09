# Nihongo Reviewer (日本語レビューアー)

A mobile-first Progressive Web App (PWA) designed as an interactive reviewer for learning Japanese from Hiragana & Katakana all the way through JLPT N1.

Built specifically for learners who cannot type or write Japanese on mobile devices—**every single input is tap-based or voice-based**. Completely free to build, self-host, and run indefinitely with zero runtime LLMs, paid APIs, or subscription costs.

---

## 🌟 Key Features

1. **Scenario Conversation Mode (41 Branching Scenarios N5–N1)**:
   - Scripted real-world dialogues spanning N5, N4, N3, N2, and N1 (Ramen shop, konbini checkout, train directions, hotel check-in, medical clinic, job interview, business alliances, boardroom presentations, and philosophical discussions).
   - **Watch Mode**: Auto-playing conversational dialogue with native Japanese text-to-speech (`ja-JP`), speed controls (0.75x–1x), and furigana/romaji/translation toggles.
   - **Role-play Mode**: The other character speaks their line; you choose or speak your reply with SpeechRecognition. Includes politeness/nuance explanations and character reactions.
   - **Fill the Line Mode**: Word-tile puzzle where you assemble your reply by tapping scrambled tokens in the correct order.
   - **Shadowing Mode**: High-focus pronunciation trainer that evaluates spoken pronunciation accuracy against native targets.
   - **Direct SRS Queueing**: One-tap button to add all key phrases from any scenario directly into your SM-2 spaced repetition review queue.
   - **Scenario Map & Badges**: Comprehensive progress map with completion checkmarks, level filters, and 8 conversation achievement badges.

2. **Access Control & 6-Digit PIN Security**:
   - Single pre-created user instance with public registrations disabled.
   - 6-digit PIN keypad with dot indicators and shake animation on failure.
   - 5-attempt limit with client cooldown timer (60s).
   - Configurable auto-lock (Immediate, 1 min, 5 min, 15 min, Never) and instant "Lock now" button in the header.
   - The PIN can be set directly in the Supabase Dashboard without exposing any hardcoded passcode.
   - Secure SHA-256 client hashing and full offline verification when disconnected from the cloud.

3. **SM-2 Spaced Repetition (SRS) Reviewer**:
   - Flashcard review engine utilizing the SuperMemo SM-2 algorithm.
   - 4-button grading: *Again* (10-min learning step), *Hard* (1.2× interval), *Good* (interval × ease), and *Easy* (bonus ease & interval).
   - Dynamic daily queue with adjustable daily new-card limits.
   - Automatic audio playback and optional furigana toggling.

4. **Tap-Only Quizzes (No Typing Needed)**:
   - **Multiple Choice**: Rapid 10-question rounds with plausible distractors.
   - **Matching Game**: Pair Japanese characters/words with English definitions.
   - **Build a Sentence**: Tap Japanese grammatical fragments in correct sequence.
   - **Listening Quiz**: Listen to Japanese speech and identify the meaning.
   - **Speed Round**: 60-second frenzy with streak multiplier bonuses.

5. **Learn Mode & Character Writing**:
   - Interactive Hiragana & Katakana syllabary charts (Basic, Voiced, Combos, and Special characters).
   - Tap-to-hear native Japanese audio synthesis (`ja-JP`).
   - Stroke-by-stroke animated stroke order using KanjiVG vector paths.
   - Hand-curated visual mnemonics and confusable character alerts (e.g., シ vs ツ, ソ vs ン).
   - Optional finger tracing on HTML5 canvas with real-time coverage evaluation.

6. **Modern Blue Design System & Full Dark Mode**:
   - Primary blue palette (`#2563EB`, scale 50-950).
   - Typography pairing: Poppins (headings), Inter (body), and Noto Sans JP (Japanese kana & kanji).
   - 16px rounded cards (`rounded-2xl`) and 48px minimum touch tap targets conforming to WCAG AA guidelines.
   - Comprehensive icon system using `lucide-react` (no emojis used in UI controls).
   - 6-tab bottom navigation bar: **Home**, **Learn**, **Review**, **Conversation**, **Progress**, and **Settings**.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 with unified design tokens (`lib/design-tokens.ts`)
- **Icons**: Lucide React
- **Offline & PWA**: Serwist Service Worker with cache-first runtime caching for static study data
- **Local Storage**: IndexedDB (via `idb`) for instant offline-first writes
- **Backend / Sync**: Supabase (Free Tier) with PostgreSQL & Row Level Security (RLS)
- **Data Bundles**: JMdict, KANJIDIC2, KanjiVG, and Tatoeba transformed into bundled static JSON
- **Testing**: Vitest with unit tests for SM-2, sync LWW conflict resolution, auth PIN lockout, and dialogue scenarios

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
- `public/data/scenarios.json` (41 scripted branching dialogue scenarios spanning N5-N1)
- `public/data/words-n5.json` through `words-n1.json` (7,600+ JMdict words)
- `public/data/kanji-n5.json` through `kanji-n1.json` & `kanji-strokes.json` (2,136 jōyō kanji)
- `public/data/sentences.json` (4,000 Tatoeba sentence pairs)

### 3. Run Unit Tests
```bash
npm test
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser (mobile device emulation in DevTools recommended).

---

## ☁️ Supabase Access Control & PIN Configuration

The app is **100% offline-first**: all progress writes directly to IndexedDB first and will sync to Supabase whenever online. The app continues working without interruptions even if Supabase is unreachable or paused.

### 1. Run the SQL Migrations
In your Supabase project dashboard, open the **SQL Editor** and run both migrations:
1. `supabase/migrations/0001_init.sql` (Tables, SM-2 fields, RLS policies, and Last-Write-Wins triggers)
2. `supabase/migrations/0002_pin_and_access.sql` (Single-user constraint, `pin_hash` trigger, and RPC functions)

### 2. Restrict to One Pre-Created User
1. In the Supabase Dashboard, go to **Authentication → Users** and click **Add user → Create user**.
2. Enter your email and initial password.
3. Next, go to **Authentication → Providers → Email** and toggle **OFF "Allow new users to sign up"**.
4. Furthermore, the database trigger `check_single_user` from migration `0002_pin_and_access.sql` will reject any subsequent inserts into `auth.users` at the database level.

### 3. Set Your 6-Digit PIN in Supabase Dashboard
You can set your 6-digit PIN in either of the following two ways without hardcoding it:

#### Method A: Supabase Table Editor
1. In the Supabase dashboard, go to the **Table Editor** and select the `profiles` table.
2. Double-click the `pin_hash` cell for your user row.
3. Type any 6-digit number (for example: `123456`) and press Enter.
4. The database trigger `profiles_hash_pin` automatically digests it to a secure SHA-256 hash!

#### Method B: Supabase SQL Editor
Run the helper RPC function in the SQL Editor:
```sql
-- Call set_user_pin with your chosen 6 digits:
select public.set_user_pin('123456');
```

When you open the app on your phone, the 6-digit PIN lock screen will prompt you for this passcode, cache the hash in local IndexedDB for airplane/subway use, and allow quick unlock.

---

## 📦 Deploy to Vercel (Hobby Tier - 100% Free)

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Framework preset will automatically detect **Next.js**.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOi...`
6. Click **Deploy**.
7. Once deployed, open the URL in your mobile browser (Safari on iOS or Chrome on Android) and tap **Add to Home Screen** / **Install App** to launch as a standalone offline PWA!

---

## 📜 Open Data Sources & Attribution

See [/credits](http://localhost:3000/credits) within the app for license texts:
- **KanjiVG**: Copyright © Ulrich Apel and contributors, licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
- **JMdict / KANJIDIC2**: Property of the Electronic Dictionary Research and Development Group (EDRDG), licensed under [CC BY-SA 4.0](https://www.edrdg.org/edrdg/licence.html).
- **Tatoeba**: Japanese-English sentence pairs by Tatoeba contributors, licensed under [CC BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/).
- **JLPT Lists**: Compiled by Jonathan Waller (tanos.co.uk), licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
- **Curated Kana, Grammar, Particles, Phrases & Scenarios**: Hand-curated by Nihongo Reviewer, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
