# Bastion Daily — Newspaper Website

A fully functional newspaper website built with Next.js.

## Features
- Homepage with hero story, side articles, category sections
- Working article pages with full content
- Category pages (Politics, World, Business, Sports, Technology, Culture, Opinion)
- Breaking news ticker
- Admin panel to add, edit, delete articles
- About page
- All links work

---

## How to deploy FREE on Vercel (step-by-step)

### Step 1 — Create a GitHub account
Go to https://github.com and sign up for free.

### Step 2 — Upload this project to GitHub
1. Click the **+** button → **New repository**
2. Name it: `bastion-daily`
3. Click **Create repository**
4. Upload all files from this folder into the repository (drag and drop in the browser, or use GitHub Desktop)

### Step 3 — Create a Vercel account
Go to https://vercel.com and sign up with your GitHub account.

### Step 4 — Deploy
1. On Vercel dashboard, click **Add New → Project**
2. Select your `bastion-daily` repository
3. Click **Deploy**
4. Wait ~2 minutes — Vercel will give you a live URL like `bastion-daily.vercel.app`

### Step 5 — Done!
Your newspaper is live. Share the URL with anyone.

---

## How to update news
Visit `yoursite.vercel.app/admin` and add articles from the admin panel.

> **Note:** On Vercel free tier, the filesystem is read-only, so article edits won't persist between deployments. To persist articles, either:
> - Edit `data/articles.json` directly and redeploy (simple)
> - Connect a free database like PlanetScale or Supabase (ask for help!)

---

## Run locally
```bash
npm install
npm run dev
```
Then open http://localhost:3000
