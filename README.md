## **RiftForge**

**League of Legends Champions Index & Quiz** — a Next.js application that lists League champions, provides detailed champion pages, includes a small interactive game (Guess The Champ), and implements a forum dedicated to talk about the game. The app is built with the Next.js App Router, Tailwind CSS, and Supabase for authentication and persistence.

---

**`https://riftforge-delta.vercel.app/`**

## Tech stack

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### **Environment variables**

To enable Supabase persistence and authentication, create `client/.env.local` with these values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for server-side operations)

```

### **Prerequisites**

- `Node.js` 18+ and `npm` (or `yarn`).

## Installation & Local Development

```bash
# Installer le projet et ses dépendances
git clone https://github.com/PingoLeon/webtech-106.git
cd webtech-106/client
&& npm install

# Lancer le serveur de développement
npm run dev
```

## Running the app

The app uses Supabase for authentication and data persistence. If you have set up the environment variables as described above, you need to configure your Supabase instance with the necessary tables and authentication settings. You need to run the [SQL query](https://raw.githubusercontent.com/leonpwd/webtech-106/refs/heads/main/client/schema.sql?token=GHSAT0AAAAAADP3VCKMJKJCZXRO7FBRTBEO2JDNNQA) provided in the repository to create the required tables. Also, for Oauth providers such as Discord and Github, ensure these are correctly setup in your Supabase project settings.

## User Guide

When first landing on the webpage, you can do multiple things as an unauthenticated user, you can checkout the index of champions, listing every League of Legends champions, their abilities and their stats as as well. Furthermore, you can Play Guess The Champ, a unique way to exercise your knowledge on your favorite game.

Next, you should checkout the forum, the bes way to share your passion and discuss with other fans about your most preferred topics. This feature is however limited to signed-in users, for obvious reasons.

## Contributing

Fork, branch, and open a PR — see the existing codebase for patterns and Tailwind utility usage.

## License & authors

This project was built as part of a Web Technologies course and is intended for educational/demo use.

Authors: Léon Dalle, Romain Barriere (Nirziin)
