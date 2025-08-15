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

