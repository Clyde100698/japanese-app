# Nihongo Reviewer (日本語レビューアー)

A mobile-first Progressive Web App (PWA) designed as an interactive reviewer for learning Japanese from Hiragana & Katakana all the way through JLPT N1.

Built specifically for learners who cannot type or write Japanese on mobile devices—**every single input is tap-based or voice-based**. Completely free to build, self-host, and run indefinitely with zero runtime LLMs, paid APIs, or subscription costs.

---

## 🌟 Key Features

1. **Original Kawaii Mascot "Aoi" (あおい) & Alive Game UI**:
   - Original, round, chubby blue creature (`#2563EB`) with big glossy anime eyes, tiny mouth, and distinctive original accessories: a sprouting green head leaf and an adventurer's crossbody leather satchel with a brass buckle (strictly zero copying or resemblance to any existing franchise characters).
   - **12 Layered Animated SVG Expressions**: `idle` (blink/breathe), `happy`, `cheering`, `sad` (encouraging), `thinking`, `listening` (sound waves active during speech recognition), `speaking` (mouth sync to TTS), `sleepy` (when you haven't studied today), `shocked`, `proud` (smug smirk on 5+ streak), `laughing` (squinted eyes with tears), and `gadget` (pulling glowing study scroll from satchel with sunburst beam reveal at lesson start).
   - English + Japanese + Romaji speech bubbles customized for every state. Respects `prefers-reduced-motion`.

2. **Winding Lesson Path (World Map) & Game Engine**:
   - Themed adventure units: **Unit 1: Greetings Town (あいさつの街)**, **Unit 2: Food Street (食べ物ストリート)**, **Unit 3: Train Station (駅と移動)**, **Unit 4: Daily Life & Kanji (日常生活と漢字)**.
   - Nodes connected by winding dotted path with 1-3 golden stars on completed nodes, pulsing glow on current active node with Aoi standing beside it, and locked nodes.
   - Top Game HUD: Hearts (5/5 with 30-min auto-regen or gem refill), daily streak flame, gems count, XP ring, and audio mute toggle.
   - **Bite-Sized Interactive Lessons**: Opening gadget reveal animation, 3D pressed tactile buttons (`btn-3d`), live mascot cheering/encouragement, friendly non-punishing empty-heart recovery, and victory screen with confetti and star rating.

3. **Kana as Characters (Illustrated Mnemonics)**:
   - Kana character cards with illustrated visual SVG art morphing glyphs into cute mnemonic objects (e.g., Apple for あ, Two Eels for い, Heavy Weight for う, Runner for え, Golf Green for お).
   - Interactive: tap to bounce, hear native pronunciation, and watch stroke-by-stroke drawing animations.

4. **Tactile Juice & Instant Web Audio Synthesizer**:
   - 3D pressed buttons with offset bottom borders (`btn-3d`, `btn-3d-blue`, `btn-3d-emerald`, `btn-3d-neutral`) and mobile haptic vibration.
   - Zero-external-file audio synthesis using the HTML5 Web Audio API (`lib/sound.ts`): tap pop (440Hz), major-scale correct chime (C5-C6), gentle boing for wrong answers, victory fanfare, and mascot squeak. Instant offline playback with 0kb asset weight.

5. **Scenario Conversation Mode (41 Branching Scenarios N5–N1)**:
   - Scripted real-world dialogues spanning N5, N4, N3, N2, and N1 (Ramen shop, konbini checkout, train directions, hotel check-in, medical clinic, job interview, business alliances, boardroom presentations, and philosophical discussions).
   - **Watch Mode**: Auto-playing conversational dialogue with native Japanese text-to-speech (`ja-JP`), speed controls (0.75x–1x), and furigana/romaji/translation toggles.
   - **Role-play Mode**: The other character speaks their line; you choose or speak your reply with SpeechRecognition. Includes politeness/nuance explanations and character reactions.
   - **Fill the Line Mode**: Word-tile puzzle where you assemble your reply by tapping scrambled tokens in the correct order.
   - **Shadowing Mode**: High-focus pronunciation trainer that evaluates spoken pronunciation accuracy against native targets.
   - **Direct SRS Queueing**: One-tap button to add all key phrases from any scenario directly into your SM-2 spaced repetition review queue.
   - **Scenario Map & Badges**: Comprehensive progress map with completion checkmarks, level filters, and 8 conversation achievement badges.

2. **Multi-User Registration & Cloud Sync (No PIN Lock)**:
   - **Open Registration & Login**: Anyone can create an account with email and password or use magic link, or play in offline Guest mode.
   - **Isolated User Progress**: Each user's study records, cards, daily stats, and review logs are strictly isolated via Supabase Row Level Security (`auth.uid() = user_id`).
   - **Zero Friction**: The 6-digit PIN screen has been completely removed so learners can jump directly into studying without entering passcodes.
   - **Seamless Offline-First**: Progress is stored immediately in IndexedDB on the device and syncs to Supabase whenever online.

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

## ☁️ Supabase Multi-User Setup & Cloud Sync

The app is **100% offline-first**: all progress writes directly to IndexedDB first and will sync to Supabase whenever online. Anyone can register their own account, or use the app as a guest, and each user gets their own separate progress.

### 1. Run the SQL Migrations
In your Supabase project dashboard, open the **SQL Editor** and run the migrations:
1. `supabase/migrations/0001_init.sql` (Tables, SM-2 fields, RLS policies, and Last-Write-Wins triggers)
2. `supabase/migrations/0003_enable_multi_user_registration.sql` (Enables open multi-user registration, auto-creates profiles, and enforces RLS isolation)

### 2. Configure Email Authentication in Supabase
1. In the Supabase Dashboard, go to **Authentication → Providers → Email**.
2. Make sure **"Enable Email provider"** is toggled **ON**.
3. Set **"Confirm email"** to **OFF** if you want instant registration without waiting for email verification, or **ON** if you want users to verify their emails first.
4. Anyone can now create their own account directly in the app at `/account` or from the user icon in the top header!

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
