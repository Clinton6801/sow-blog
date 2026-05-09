-- ============================================================
-- SOW Chronicle — Supabase table migrations
-- Run these in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Contact messages (for the contact form admin page)
CREATE TABLE IF NOT EXISTS contact_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  subject     text NOT NULL,
  message     text NOT NULL,
  read        boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- 2. Press club team (for the About page)
CREATE TABLE IF NOT EXISTS press_club_team (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  role        text NOT NULL,
  student_class text,
  photo_url   text,
  active      boolean DEFAULT true,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Seed with default team members
INSERT INTO press_club_team (name, role, student_class, sort_order) VALUES
  ('Editor-in-Chief',       'Leads editorial direction and final publishing decisions', 'SS3', 1),
  ('News Editor',           'Oversees news coverage and reporter assignments',          'SS2', 2),
  ('Sports Correspondent',  'Covers all sports events and inter-house competitions',    'SS2', 3),
  ('Arts & Culture Editor', 'Manages cultural stories, drama, and creative features',  'SS1', 4),
  ('Photography Editor',    'Captures events and provides visual storytelling',         'SS2', 5),
  ('Junior Reporter',       'Reports on academic and student life stories',             'JSS3', 6)
ON CONFLICT DO NOTHING;

-- 3. Clubs
CREATE TABLE IF NOT EXISTS clubs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  slug         text NOT NULL UNIQUE,
  tagline      text,
  description  text,
  color        text DEFAULT '#1e3a8a',
  emoji        text DEFAULT '🏫',
  cover_url    text,
  patron       text,
  meeting_day  text,
  member_count int,
  active       boolean DEFAULT true,
  sort_order   int DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- Seed with default clubs
INSERT INTO clubs (name, slug, tagline, color, emoji, sort_order) VALUES
  ('Press Club',    'press',    'Reporting with truth and clarity',          '#1e3a8a', '📰', 1),
  ('STEM Club',     'stem',     'Science, Technology, Engineering & Maths',  '#15803d', '🔬', 2),
  ('Literary Club', 'literary', 'Celebrating the written and spoken word',   '#7c3aed', '📚', 3),
  ('Debate Club',   'debate',   'Sharpening minds through argument',         '#dc2626', '🎤', 4),
  ('Drama Club',    'drama',    'Bringing stories to life on stage',         '#d97706', '🎭', 5),
  ('Music Club',    'music',    'Harmony, rhythm, and performance',          '#0e7490', '🎵', 6)
ON CONFLICT (slug) DO NOTHING;

-- 4. Club posts
CREATE TABLE IF NOT EXISTS club_posts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id        uuid NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  title          text NOT NULL,
  excerpt        text,
  content        text NOT NULL DEFAULT '',
  cover_url      text,
  author_name    text,
  published      boolean DEFAULT false,
  gallery_images jsonb DEFAULT '[]',
  reading_time   int,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- Index for fast club lookups
CREATE INDEX IF NOT EXISTS idx_club_posts_club_id ON club_posts(club_id);
CREATE INDEX IF NOT EXISTS idx_club_posts_published ON club_posts(published, created_at DESC);

-- ============================================================
-- RLS Policies (enable Row Level Security)
-- ============================================================

-- contact_messages: only service role can read/write
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON contact_messages USING (false);

-- press_club_team: public read
ALTER TABLE press_club_team ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON press_club_team FOR SELECT USING (true);

-- clubs: public read
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON clubs FOR SELECT USING (true);

-- club_posts: public read published only
ALTER TABLE club_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON club_posts FOR SELECT USING (published = true);
