# Supabase Profiles React App

This is a **React + Vite + Supabase** project for managing user profiles with authentication and profile picture uploads.  
It integrates **Supabase Auth**, **profiles table**, and a **`pfp` storage bucket**. Users can sign up, sign in, view, and edit their profile.

---

## Features

- Sign up using **username, email, password**.
- Sign in using **username + password**.
- Profile page shows **all fields from `profiles`** table and **email from Supabase Auth**.
- Edit profile page allows editing **all fields except email**.
- Upload profile picture; old image is deleted and replaced automatically.
- Uses **localStorage** to persist session and profile data.
- Supabase policies secure data access.

---

## Project Setup

### 1. Clone the Repo

```bash
git clone https://github.com/<your-username>/supabase-profiles-react.git
cd supabase-profiles-react

2. Install Dependencies
npm install react react-dom react-router-dom react-icons react-bootstrap bootstrap
npm install @supabase/supabase-js
npm install -D vite

3. Configure Supabase API & API KEY in .env file

4. Supabase Database Structure run this SQL
profiles Table
create table public.profiles (
  id bigserial primary key,
  created_at text unique not null default now(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  username text unique not null,
  first_name text,
  last_name text,
  pfp_url text,
  bio text,
  gender text,
  birthdate date,
  nationality text,
  languages jsonb,
  phone_number text,
  location_city text,
  location_coordinates jsonb,
  preferred_currency text check (char_length(preferred_currency) = 3),
  is_verified boolean default false,
  arrival_date date,
  plan text default 'free',
  plan_start_date date,
  plan_end_date date,
  status text default 'active',
  role text default 'user',
  updated_at timestamp
);

5. profiles Table Policies

Select: anyone can read profiles.
Insert: anyone can insert profiles.
Update: only profile owner can update.

create policy "Allow anyone to select profiles" as permissive
on public.profiles for select using (true);

create policy "Allow insert for profiles" as permissive
on public.profiles for insert with check (true);

create policy "Allow update for profile owner" as permissive
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

6. Create bucket in a storage called 'pfp'

create policy "Allow public read for profile pictures"
as permissive
on storage.objects
for select
using (bucket_id = 'pfp');

create policy "Allow upload for owner"
as permissive
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'pfp' and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Allow update for owner"
as permissive
on storage.objects
for update
to authenticated
using (
  bucket_id = 'pfp' and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'pfp' and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Allow delete for owner"
as permissive
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'pfp' and auth.uid()::text = (storage.foldername(name))[1]
);



7. App Workflow
AuthContext.jsx
Manages session, user, profile.
Stores session/user/profile in localStorage.
Functions: signUp, signIn, signOut, fetchUserProfile.

SignUp.jsx
Takes username, email, password.
Creates Supabase Auth user and profiles entry.
After sign up, user is automatically logged in and redirected to Profile page.

SignIn.jsx
Takes username + password.
Fetches profiles by username, retrieves associated email from Auth Users.
Logs in user with email + password.
Saves session, profile to localStorage.

Profile.jsx
Shows all profile fields from profiles table.
Shows email from Auth Users.
If the profile belongs to session user, shows Edit Profile button.

EditProfile.jsx
Only accessible by profile owner.
Loads all fields from profiles.
Editable fields: everything except email.
Uploads new profile picture:
Deletes old one if exists.
Uploads new file with timestamped filename to prevent cache issues.
Updates pfp_url in profiles.
Saves changes to profiles table and refreshes context.


8. Running the Project
npm run dev

9. Libraries Used
React
Vite
Supabase JS
React Router DOM

10. Notes
Use localStorage to persist session and profile data.
Unique profile picture filenames prevent caching issues.
Ensure Supabase RLS policies are properly configured.
Bucket structure: /pfp/<user_id>/profile_<timestamp>.jpg.

