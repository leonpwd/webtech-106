-- Create post_likes table
create table if not exists public.post_likes (
  user_id uuid references auth.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, post_id)
);

-- Create comment_likes table
create table if not exists public.comment_likes (
  user_id uuid references auth.users(id) on delete cascade not null,
  comment_id uuid references public.comments(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, comment_id)
);

-- Enable RLS
alter table public.post_likes enable row level security;
alter table public.comment_likes enable row level security;

-- Policies for post_likes
create policy "Public post likes are viewable by everyone"
  on public.post_likes for select
  using ( true );

create policy "Authenticated users can insert their own post likes"
  on public.post_likes for insert
  with check ( auth.uid() = user_id );

create policy "Authenticated users can delete their own post likes"
  on public.post_likes for delete
  using ( auth.uid() = user_id );

-- Policies for comment_likes
create policy "Public comment likes are viewable by everyone"
  on public.comment_likes for select
  using ( true );

create policy "Authenticated users can insert their own comment likes"
  on public.comment_likes for insert
  with check ( auth.uid() = user_id );

create policy "Authenticated users can delete their own comment likes"
  on public.comment_likes for delete
  using ( auth.uid() = user_id );
