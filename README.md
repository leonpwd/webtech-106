## **Project Title**

**League of Legends Champions Index & Quiz** — a Next.js application that lists League champions, provides detailed champion pages, and includes a small interactive game (Guess The Champ). The app is built with the Next.js App Router, Tailwind CSS, and Supabase for authentication and persistence.

---

**Live demo (example):** `https://riftforge-delta.vercel.app/` (may be outdated; your local dev server runs at `http://localhost:3000`).

## **Quick Overview**
- **Stack:** Next.js (App Router), React, Tailwind CSS, Supabase (auth + Postgres), client-side JSON fallbacks in `public/data`.
- **Key features implemented:** authentication via Supabase, champion index, champion detail pages, Guess The Champ (`/gtc`) interactive game with hint logic, user dashboard and theme persistence, forum with posts and comments (including inline comment editing), search/typeahead, responsive UI.

## **Getting Started**

### **Prerequisites**
- `Node.js` 18+ and `npm` (or `yarn`).

### **Clone & Install**

```bash
git clone https://github.com/PingoLeon/webtech-106.git
cd webtech-106/client
npm install
```

### **Environment variables**
To enable Supabase persistence and authentication, create `client/.env.local` with these values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

If these values are not provided the app falls back to static JSON in `public/data` and stores theme preference in `localStorage`.

### **Run locally**

```bash
# start dev server
npm run dev

# build for production
npm run build
npm start
```

---

## **Project Structure (important paths)**
- `client/` — Next.js app code (pages, components, styles)
- `client/public/data/` — local JSON data: `champions.json`, `champions_meta.json` (used by the Guess The Champ game)
- `client/components/` — reusable UI components (including `forum/` components)
- `client/app/gtc` — Guess The Champ page and logic
- `client/app/api` — (if present) API routes; this project mainly uses Supabase client directly from the frontend
- `client/schema.sql` — SQL schema used for Supabase (tables, RLS policies)

---

## **Features & Implementation Notes**

- **Authentication:** Supabase auth is integrated. The header shows login/logout and per-user metadata (theme color). If Supabase environment variables are absent the app works in a limited, local-only mode.

- **Champions data:** Champion metadata lives in `client/public/data/champions_meta.json` and `champions.json`. The Guess The Champ game uses `release_year` and other metadata to provide hints. Some metadata was completed/updated during development; if you need authoritative updates, edit the JSON file directly.

- **Guess The Champ (GTC):** UI changes include colored badges for hint matching: exact = green, partial (word in common) = orange, none = red, blank = grey. The `release_year` hint shows ▲ if the hidden champion is younger (released later) and ▼ if older. Previously shown numeric stats are hidden per UX request. The suggestion list excludes already-guessed champions.

- **Forum (posts & comments):** Comments can be created and edited inline. The client calls Supabase to update a comment; the DB schema includes an `updated_at` timestamp on `comments` and an RLS policy permitting users to update their own comments (`using ( auth.uid() = author_id )`). See `client/schema.sql` for details.

- **Search & Typeahead:** Client-side typeahead uses `public/data/champions.json`. Server-side full-text search (Supabase FTS) is an optional task — if you need server-side search, the existing codebase can be extended to run FTS queries via a small API route or directly via Supabase functions.

---

## **Database & Supabase**

- **Schema:** `client/schema.sql` contains the Postgres schema used in this project. Notable entries:
  - `public.comments` includes `updated_at` (timestamp) and is governed by RLS policies allowing owners to edit their comments.

- **Policies & RLS:** This project uses Row-Level Security for user-owned resources (posts/comments). When deploying to Supabase, enable RLS and apply the provided policies from `client/schema.sql`.

- **Seeding / Migration:** There is no automated migration included. To initialize your Supabase DB, use the SQL statements in `client/schema.sql` in the Supabase SQL editor, then populate sample data as needed.

---

## **Testing & Utilities**

- **Quick test runner:** A small test helper exists at `scripts/run_tests.js` — its usage is project-specific and lightweight. You can inspect and run it with:

```bash
node scripts/run_tests.js
```

- **Manual testing:** Start the dev server and verify these flows in the browser:
  - Sign in with Supabase (GitHub provider) and verify the dashboard/profile updates.
  - Open a post and create/edit/delete a comment (ensure author-only edit/delete behavior).
  - Play Guess The Champ: select suggestions and validate hint colors, history entries, and year arrows.

---

## **Development notes & common commands**

- Install dependencies: `npm install`
- Start dev server: `npm run dev` (runs the Next.js dev server from `client/`)
- Build: `npm run build`
- Start production server: `npm start`

If you need to run commands from the repo root, ensure you `cd client` first.

---

## **Contributing**

- Use feature branches and open Pull Requests. Follow the existing code patterns and Tailwind utility usage.
- For major UI changes check with the project owner before large refactors.

---

## **Project mapping & concise self-evaluation**

This project was built to satisfy the course tasks listed in `PROJECT.md`. Below is a concise mapping of required tasks (points) and the current implementation status.

- **Project structure and naming conventions (2 pts):** Implemented — project is organized into `client/`, `public/`, and `scripts/` folders. (Status: Done)
- **Git usage (2 pts):** Use conventional commits and meaningful messages when committing. (Status: developer-managed)
- **Project documentation (2 pts):** This `README.md` and `PROJECT.md` provide description and instructions. (Status: Done)
- **Proper package.json (2 pts):** `client/package.json` contains scripts and metadata. (Status: Done)
- **Code quality (4 pts):** Code follows consistent patterns and uses Tailwind; minimal inline comments and raisonnable structure. (Status: Partial — could add linting config)
- **Design, UX, content (4 pts):** Responsive UI, theme switcher, animated background and polished components. (Status: Done)

Application development features:
- **Home & Navigation (2 pts):** Implemented — shared layout and header. (Status: Done)
- **Login & profile (4 pts):** Supabase auth integrated; profile/dashboard exist. (Status: Done)
- **Post creation/display (6 pts):** Posts and post pages exist; creation UI present in forum patterns — adapt as needed. (Status: Partial)
- **Comment creation/display (4 pts):** Implemented; inline comment creation and editing added, with DB update support. (Status: Done)
- **Post modification/removal (4 pts):** Edit/remove for post authors available (follow patterns). (Status: Partial)
- **Search (6 pts):** Client-side typeahead implemented; server-side full text search via Supabase is available as an extension (not deployed). (Status: Partial)
- **External API (2 pts):** App uses local champion data; external API integration is optional. (Status: Not implemented)
- **Resource access control (6 pts):** RLS policies added for comments; ensure all tables have correct policies before deployment. (Status: Partial — review required)
- **Account settings (4 pts):** Dashboard contains profile settings and theme. (Status: Done)
- **WYSIWYG (2 pts):** Not implemented — markdown/plain text editors used for now. (Status: Not implemented)
- **Gravatar (2 pts):** Not implemented by default; avatar support uses Supabase user metadata. (Status: Not implemented)
- **Light/dark mode (2 pts):** Implemented. (Status: Done)

Concise self-evaluation: the core features (auth, comments, UI, champion index, GTC) are implemented and documented. Remaining items for full marks: server-side search (Supabase FTS), automated DB migrations/seeding, WYSIWYG editor, and additional RLS reviews.

---

## **Where to look next / how I can help**

- Want me to commit these README changes and push a branch? I can do that for you.
- I can also: add an automated migration script for Supabase, enable server-side search, or finish the champions metadata sweep.

If you want one of these, tell me which and I will proceed.

---

Authors: Léon Dalle, Nirziin

License: educational / demo use
# League of Legends Champions Index & Quiz 🚀

A modern, animated Next.js web application showcasing an index of League of Legends champions and an interactive quiz about these characters. Built with cutting-edge technologies and featuring a beautiful, responsive design.

## 🌟 Live Demo

**🚀 Production:** [https://riftforge-delta.vercel.app/](https://riftforge-delta.vercel.app/)

**🔧 Local Development:** [http://localhost:3000](http://localhost:3000)

## ✨ Features

### 🎨 Modern Design
- **Animated landing page** with floating background elements
- **Gradient backgrounds** and smooth transitions
- **Interactive hover effects** with scale transforms
- **Dark/Light mode support** (class-based theming)
- **Fully responsive** design for all devices

### 📱 Pages & Functionality
- **Home** (`/`) - Stunning animated landing page with hero section
- **Champions** (`/champions`) - Index of League of Legends champions
- **Guess The Champ** (`/gtc`) - Interactive quiz about League of Legends champions
- **Dashboard** (`/dashboard`) - Profile management

## Key highlights implemented in this branch

- Modern responsive `SiteHeader` with search, theme toggle, avatar dropdown and mobile panel
- Inline search suggestions (typeahead) powered by `public/data/champions.json` with keyboard navigation and direct links
- Exact-match search redirect to a champion page when a query exactly matches an id/name/key
- `ThemeManager` + runtime CSS variables for accent color and meta theme-color tags
- Per-user theme persistence: toggling theme saves to Supabase user metadata (falls back to `localStorage`)
- Dashboard (`/dashboard`) with icon picker and color picker; color presets and live preview
- Animated WebGL background (`ModernBackground`) with light/dark-aware rendering and reduced artifacts
- Champion index and detail pages with case-insensitive lookups and theme-aware cards

## Tech stack

- Next.js (App Router)
- React 19+ (client and server components)
- Tailwind CSS with CSS variable theming
- Supabase for auth and user metadata (optional; app runs with local JSON fallback)

## Local development

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm (or yarn)

### Quick start

1. Clone the repository

```bash
git clone https://github.com/PingoLeon/webtech-106.git
cd webtech-106/client
```

2. Install dependencies

```bash
npm install
```

3. Optional: set environment variables for Supabase (if using persistence)

Create a `.env.local` in `client/` with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

If Supabase vars are not provided the app will fall back to `public/data/champions.json` for content and store theme in `localStorage`.

4. Start the dev server

```bash
npm run dev
# Opens at http://localhost:3000
```

5. Build for production

```bash
npm run build
npm start
```

## Contributing

Fork, branch, and open a PR — see the existing codebase for patterns and Tailwind utility usage.

## License & authors

This project was built as part of a Web Technologies course and is intended for educational/demo use.

Authors: Léon Dalle, Romain Barriere (Nirziin)