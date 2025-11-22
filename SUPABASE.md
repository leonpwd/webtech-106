# Supabase setup & database notes

This document explains how to initialize and configure the Supabase database used by this project, apply the SQL schema, enable Row-Level Security (RLS), and seed useful sample data for manual testing.

Files referenced:

- `client/schema.sql` — the SQL schema used by the project (tables, constraints, and policies).
- `client/components/forum/CommentSection.tsx` — client code that updates comments and depends on `comments.updated_at` + RLS policy.

## Quick summary

- Create a Supabase project and copy the SQL from `client/schema.sql` into the Supabase SQL editor, or run it with the Supabase CLI / `psql` against your database.
- Ensure RLS is enabled for user-owned tables and apply the policies (example policy for `comments` is included in `client/schema.sql`).
- Add environment variables to `client/.env.local`: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## Step-by-step setup (recommended)

1. Create a Supabase project at https://app.supabase.com and note the project ref and API keys.

2. In your local `client/.env.local` add the public environment variables used by the frontend:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
```

3. Initialize the database schema.

Option A — Supabase SQL editor (recommended for quick setup):

- Open your Supabase project, go to `SQL` → `Editor`, paste the contents of `client/schema.sql`, then run it.

Option B — Supabase CLI + psql (recommended for scripted setups):

```bash
# install supabase CLI (if not installed)
npm install -g supabase

supabase login
supabase link --project-ref <PROJECT_REF>

# get your database connection string from the Supabase dashboard (Settings → Database → Connection string)
export SUPABASE_DB_URL="postgres://..."

# apply schema with psql
psql "$SUPABASE_DB_URL" -f client/schema.sql
```

Notes:

- If you prefer a migration workflow, use the Supabase CLI and a migrations folder, or a third-party migration tool. The repository currently provides `client/schema.sql` as the canonical schema source.

---

## RLS and the `comments` table

This project uses Row-Level Security (RLS) for user-owned resources. The `comments` table includes an `updated_at` column and an update policy allowing users to update their own comments. Example SQL (also present in `client/schema.sql`):

```sql
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can update their own comments"
ON public.comments
FOR UPDATE
USING ( auth.uid() = author_id );
```

Important: ensure RLS is enabled on any table you want access-controlled, and define both `SELECT`/`INSERT`/`UPDATE` policies as needed.

## `updated_at` timestamp

`comments.updated_at` is used to record the last modification time of a comment. The client `CommentSection` updates `updated_at` when a comment is edited. If you run custom update SQL, ensure `updated_at` is updated appropriately (e.g., `UPDATE ... SET content = $1, updated_at = timezone('utc', now()) ...`).

---

## Seeding sample data (manual)

Because Supabase `auth.users` contains user UUIDs, the easiest way to seed comment data is to:

1. Create a test user by signing up via the app (or create a user in the Supabase Auth UI).
2. Get the user's `id` from the `auth.users` table (Supabase Dashboard → Authentication → Users).
3. Insert a sample post/comment referencing that `author_id`:

```sql
-- sample post
INSERT INTO public.posts (id, title, content, author_id, created_at)
VALUES (gen_random_uuid(), 'Sample post', 'This is a seeded post', '<AUTHOR_UUID>', timezone('utc', now()));

-- sample comment
INSERT INTO public.comments (id, post_id, content, author_id, created_at, updated_at)
VALUES (gen_random_uuid(), '<POST_ID>', 'Sample comment content', '<AUTHOR_UUID>', timezone('utc', now()), timezone('utc', now()));
```

Replace `<AUTHOR_UUID>` and `<POST_ID>` with actual values from your DB.

---

## Automated migration tips

- Use `supabase` CLI migrations if you want repeatable deployments:

```bash
supabase migration new init_schema
# edit migration file and copy SQL
supabase db push
```

- Alternatively commit `client/schema.sql` and run it via CI to apply schema changes to staging/production.

---

## Troubleshooting

- If the client can't access Supabase: verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `client/.env.local` and restart the dev server.
- If comment updates fail with a permission error: check that RLS is enabled on `comments` and the `UPDATE` policy allows `auth.uid() = author_id`.
- If you're testing on localhost and want to bypass Supabase auth for quick checks, the app supports local JSON fallbacks in `client/public/data`, but DB features (comments, persistence) require Supabase.

---

If you want, I can:

- Add a `supabase:seed` script to `client/package.json` that runs `psql` with `client/schema.sql` and optional seed SQL.
- Create a migrations folder and wire up `supabase` CLI migrations.

Tell me which option you prefer and I'll proceed.
