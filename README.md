# The SOW Chronicle — v4
**Official Press Club of Seat of Wisdom Group of Schools, Ibadan**

Full-stack newspaper-style blog — Next.js 14 · TypeScript · Tailwind CSS · Supabase

---

## Complete Feature List

### Public Site
- Bold newspaper aesthetic — blue nav, rainbow category colours, gold accents
- 🌙 Dark mode toggle (persists across sessions)
- Homepage with featured hero, latest stories, Most Read sidebar, pagination
- ⭐ Genius of the Week section on homepage (gold spotlight cards)
- Breaking news ticker (managed from admin)
- Article pages with reading time, view counter, related articles, social share
- WhatsApp, Facebook, Twitter share + Copy Link + Print buttons
- Comments (pending approval before showing)
- Category pages with pagination (News, Academics, Sports, Arts, Opinion, Events)
- 🔍 Enhanced search with filters (keyword, category, author, date range)
- Author profile pages
- Article tags — click a tag to see all related articles
- 📅 Events Calendar page
- 🖼 Photo Gallery page
- ⭐ Genius of the Week full page + Hall of Fame
- About page, Contact page, Student submission form (with photo upload)
- Newsletter subscription

### Admin Panel (/admin/login)
- Password-protected with session tokens (7-day sessions)
- All admin API routes secured with token validation
- Dashboard with live stats
- Write articles with TipTap rich text editor + cover image upload + tags
- Approve/reject student submissions (auto-publishes approved ones with photo)
- Comment moderation (approve or delete)
- ⭐ Genius of the Week manager (add photo, activate/deactivate entries)
- Gallery manager (upload/edit/delete photos)
- Events manager (add/edit/delete calendar events)
- Ticker manager (add/toggle/delete breaking news items)
- Category manager (add/delete categories)
- Newsletter subscribers list

### Backend
- Supabase Postgres with Row Level Security on all tables
- Supabase Storage for image uploads
- Email notifications on new submissions and comments (via Resend — optional)

---

## Setup Instructions

### Step 1 — Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Wait for it to be ready

### Step 2 — Run All SQL Schemas (in order)
In Supabase → SQL Editor, run each file one at a time:
1. `supabase_schema.sql` — base tables + seed articles
2. `supabase_schema_v2.sql` — auth sessions, ticker, gallery, events, storage bucket
3. `supabase_schema_v3.sql` — tags, genius_of_week, reading_time column

### Step 3 — Environment Variables
```bash
cp .env.local.example .env.local
```
Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD` — your chosen admin password
- `NEXT_PUBLIC_SITE_URL` — your deployed URL (or http://localhost:3000)
- `RESEND_API_KEY` — optional, for email notifications (free at resend.com)
- `NOTIFY_EMAIL` — email address to receive notifications

### Step 4 — Install & Run
```bash
npm install
npm run dev
```

---

## Key URLs

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/genius` | Genius of the Week |
| `/gallery` | Photo Gallery |
| `/events` | School Events Calendar |
| `/search` | Search with filters |
| `/submit` | Student story submission |
| `/about` | About the Press Club |
| `/contact` | Contact form |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin home |
| `/admin/genius` | Manage Genius of the Week |
| `/admin/articles` | Write & manage articles |
| `/admin/submissions` | Review student submissions |
| `/admin/comments` | Moderate comments |
| `/admin/gallery` | Manage photos |
| `/admin/events` | Manage calendar events |
| `/admin/ticker` | Manage breaking news |
| `/admin/categories` | Manage categories |
| `/admin/newsletter` | View subscribers |

---

## Deployment (Vercel)
1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Deploy

---

Built with ❤️ for Seat of Wisdom Group of Schools Press Club · Ibadan, Oyo State
