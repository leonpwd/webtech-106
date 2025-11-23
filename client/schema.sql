-- ==============================================================================
-- RESET SCRIPT
-- Warning: This script drops all tables and data.
-- ==============================================================================

-- 1. Drop existing objects
drop trigger if exists set_author_name_posts on public.posts;
drop trigger if exists set_author_name_comments on public.comments;
drop function if exists public.set_author_name_on_insert();
drop function if exists search_posts(text);
drop function if exists is_admin();
drop table if exists public.post_likes;
drop table if exists public.comment_likes;
drop table if exists public.comments;
drop table if exists public.posts;

-- ==============================================================================
-- TABLES
-- ==============================================================================

-- Create posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  author_email text,
  author_name text,
  author_avatar_url text,
  categories text[] default '{}',
  tags text[] default '{}'
);

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content text not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete cascade,
  author_email text not null,
  author_name text,
  author_avatar_url text
);

-- Create post_likes table
create table public.post_likes (
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, post_id)
);

-- Create comment_likes table
create table public.comment_likes (
  user_id uuid references auth.users(id) on delete cascade not null,
  comment_id uuid references public.comments(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, comment_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.comment_likes enable row level security;

-- Helper function for Admin check
create or replace function is_admin()
returns boolean language sql security definer as $$
  select auth.email() = 'leon.dalle@proton.me';
$$;

-- --- POSTS POLICIES ---

create policy "Public posts are viewable by everyone"
  on public.posts for select
  using ( true );

create policy "Users can create their own posts"
  on public.posts for insert
  with check ( auth.uid() = author_id );

create policy "Users can update their own posts"
  on public.posts for update
  using ( auth.uid() = author_id );

create policy "Users can delete their own posts"
  on public.posts for delete
  using ( auth.uid() = author_id );

create policy "Admins can delete any post"
  on public.posts for delete
  using ( is_admin() );

-- --- COMMENTS POLICIES ---

create policy "Public comments are viewable by everyone"
  on public.comments for select
  using ( true );

create policy "Authenticated users can create comments"
  on public.comments for insert
  with check ( auth.uid() = author_id );

create policy "Anyone can create comments"
  on public.comments for insert
  with check ( true );

create policy "Users can update their own comments"
  on public.comments for update
  using ( auth.uid() = author_id );

create policy "Users can delete their own comments"
  on public.comments for delete
  using ( auth.uid() = author_id );

create policy "Admins can delete any comment"
  on public.comments for delete
  using ( is_admin() );

-- --- LIKES POLICIES ---

-- Post Likes
create policy "Public post likes are viewable by everyone"
  on public.post_likes for select
  using ( true );

create policy "Authenticated users can insert their own post likes"
  on public.post_likes for insert
  with check ( auth.uid() = user_id );

create policy "Authenticated users can delete their own post likes"
  on public.post_likes for delete
  using ( auth.uid() = user_id );

-- Comment Likes
create policy "Public comment likes are viewable by everyone"
  on public.comment_likes for select
  using ( true );

create policy "Authenticated users can insert their own comment likes"
  on public.comment_likes for insert
  with check ( auth.uid() = user_id );

create policy "Authenticated users can delete their own comment likes"
  on public.comment_likes for delete
  using ( auth.uid() = user_id );

-- ==============================================================================
-- FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Search function
create or replace function search_posts(keyword text)
returns setof public.posts
language sql
as $$
  select *
  from public.posts
  where to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', keyword)
  order by created_at desc;
$$;

-- Secure Author Data Trigger
-- Enforces that author_id and author_email come from the authenticated session
create or replace function public.set_author_name_on_insert()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  raw jsonb;
  provider_name text;
  avatar_candidate text;
begin
  -- Enforce author_id to be the current user
  if new.author_id is null then
    new.author_id := auth.uid();
  end if;

  -- Enforce author_email from auth.email() if authenticated
  -- This prevents spoofing
  if auth.role() = 'authenticated' then
    new.author_email := auth.email();
  end if;

  if new.author_id is not null then
    select raw_user_meta_data into raw from auth.users where id = new.author_id limit 1;
    if raw is not null then
      provider_name := (raw->>'name');
      avatar_candidate := coalesce(raw->>'avatar_url', raw->>'icon', raw->>'picture');
    end if;
  end if;

  if provider_name is not null and length(trim(provider_name)) > 0 then
    new.author_name := provider_name;
  else
    if new.author_email is not null then
      new.author_name := split_part(new.author_email, '@', 1);
    else
      new.author_name := null;
    end if;
  end if;

  if avatar_candidate is not null and (new.author_avatar_url is null or length(trim(coalesce(new.author_avatar_url, ''))) = 0) then
    new.author_avatar_url := avatar_candidate;
  end if;

  return new;
end;
$$;

-- Attach trigger for posts
create trigger set_author_name_posts
before insert on public.posts
for each row
execute procedure public.set_author_name_on_insert();

-- Attach trigger for comments
create trigger set_author_name_comments
before insert on public.comments
for each row
execute procedure public.set_author_name_on_insert();
