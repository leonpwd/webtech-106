# Client

Development instructions for the client app.

## Development

From the `client/` folder:

```bash
npm install
npm run dev
```

## Backfill author names

If you need to populate `author_name` for existing `posts` and `comments` from provider metadata, run the included script.

Usage:

```bash
cd client
SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
node scripts/backfill_author_names.js
```

The script requires a Supabase service role key because it reads from the `users` table in the `auth` schema.
