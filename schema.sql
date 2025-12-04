-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  role text check (role in ('citizen', 'council', 'admin')) default 'citizen',
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create issues table
create table public.issues (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  category text not null,
  image_url text,
  latitude float,
  longitude float,
  status text check (status in ('Reported', 'In Progress', 'Resolved')) default 'Reported',
  reporter_id uuid references public.profiles(id) not null,
  upvote_count int default 0
);

alter table public.issues enable row level security;

create policy "Issues are viewable by everyone."
  on issues for select
  using ( true );

create policy "Authenticated users can insert issues."
  on issues for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own issues."
  on issues for update
  using ( auth.uid() = reporter_id );

-- Create upvotes table
create table public.upvotes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  issue_id uuid references public.issues(id) not null,
  user_id uuid references public.profiles(id) not null,
  unique(issue_id, user_id)
);

alter table public.upvotes enable row level security;

create policy "Upvotes are viewable by everyone."
  on upvotes for select
  using ( true );

create policy "Authenticated users can insert upvotes."
  on upvotes for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can delete their own upvotes."
  on upvotes for delete
  using ( auth.uid() = user_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', COALESCE(new.raw_user_meta_data->>'role', 'citizen'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
