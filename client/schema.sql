-- Create posts table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  author_email text,
  categories text[] default '{}',
  tags text[] default '{}'
);

-- Create comments table
create table if not exists public.comments (
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

-- Enable RLS
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- Policies for posts
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

-- Policies for comments
create policy "Public comments are viewable by everyone"
  on public.comments for select
  using ( true );

create policy "Authenticated users can create comments"
  on public.comments for insert
  with check ( auth.uid() = author_id );

-- Allow anonymous comments if we want (optional, but project says "Users must at least provide a content and email")
-- For now, let's stick to authenticated or at least require email. 
-- If we want unauthenticated comments, we'd need to relax the author_id check or make it nullable.
-- The schema above allows author_id to be nullable, but let's add a policy for it if needed.
-- For now, let's assume mostly authenticated, but the requirement says "Users must at least provide a content and email properties", implying maybe guests can comment?
-- "You can be inspired by commenting on GitHub issues" usually implies auth.
-- Let's allow anyone to insert if they provide an email, but ideally we link to auth user if logged in.

create policy "Anyone can create comments"
  on public.comments for insert
  with check ( true );

-- Users can update their own comments
create policy "Users can update their own comments"
  on public.comments for update
  using ( auth.uid() = author_id );

-- Only author or post author might delete? Let's keep it simple: author can delete.
create policy "Users can delete their own comments"
  on public.comments for delete
  using ( auth.uid() = author_id );

-- Create a function to search posts
create or replace function search_posts(keyword text)
returns setof public.posts
language sql
as $$
  select *
  from public.posts
  where to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', keyword)
  order by created_at desc;
$$;
