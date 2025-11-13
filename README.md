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

Authors: Léon Dalle, Nirziin


