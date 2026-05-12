-- ============================================================
-- SOW Chronicle — Supabase table migrations
-- Run these in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. Contact messages ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  read       boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ── 2. Press club team (About page) ──────────────────────────
CREATE TABLE IF NOT EXISTS press_club_team (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  role          text NOT NULL,
  student_class text,
  photo_url     text,
  active        boolean DEFAULT true,
  sort_order    int DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

INSERT INTO press_club_team (name, role, student_class, sort_order) VALUES
  ('Editor-in-Chief',       'Leads editorial direction and final publishing decisions', 'SS3',  1),
  ('News Editor',           'Oversees news coverage and reporter assignments',          'SS2',  2),
  ('Sports Correspondent',  'Covers all sports events and inter-house competitions',    'SS2',  3),
  ('Arts & Culture Editor', 'Manages cultural stories, drama, and creative features',  'SS1',  4),
  ('Photography Editor',    'Captures events and provides visual storytelling',         'SS2',  5),
  ('Junior Reporter',       'Reports on academic and student life stories',             'JSS3', 6)
ON CONFLICT DO NOTHING;

-- ── 3. Clubs ─────────────────────────────────────────────────
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

INSERT INTO clubs (name, slug, tagline, color, emoji, sort_order) VALUES
  ('Press Club',    'press',    'Reporting with truth and clarity',          '#1e3a8a', '📰', 1),
  ('STEM Club',     'stem',     'Science, Technology, Engineering & Maths',  '#15803d', '🔬', 2),
  ('Literary Club', 'literary', 'Celebrating the written and spoken word',   '#7c3aed', '📚', 3),
  ('Debate Club',   'debate',   'Sharpening minds through argument',         '#dc2626', '🎤', 4),
  ('Drama Club',    'drama',    'Bringing stories to life on stage',         '#d97706', '🎭', 5),
  ('Music Club',    'music',    'Harmony, rhythm, and performance',          '#0e7490', '🎵', 6)
ON CONFLICT (slug) DO NOTHING;

-- ── 4. Club posts ─────────────────────────────────────────────
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

CREATE INDEX IF NOT EXISTS idx_club_posts_club_id   ON club_posts(club_id);
CREATE INDEX IF NOT EXISTS idx_club_posts_published ON club_posts(published, created_at DESC);

-- ── 5. Honours Board ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS honours (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  student_class text,
  campus       text,
  title        text NOT NULL,
  description  text,
  category     text DEFAULT 'other',
  achieved_at  date,
  photo_url    text,
  featured     boolean DEFAULT false,
  published    boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_honours_published  ON honours(published, achieved_at DESC);
CREATE INDEX IF NOT EXISTS idx_honours_featured   ON honours(featured) WHERE featured = true;

-- ── 6. Term Digests ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS term_digests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  term          text NOT NULL DEFAULT 'First Term',
  academic_year text NOT NULL DEFAULT '',
  intro         text,
  content       text DEFAULT '',
  cover_url     text,
  highlights    jsonb DEFAULT '[]',
  stats         jsonb DEFAULT '{}',
  published     boolean DEFAULT false,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ── 7. Campus column on articles ─────────────────────────────
-- Add campus column to existing articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS campus text;
CREATE INDEX IF NOT EXISTS idx_articles_campus ON articles(campus) WHERE campus IS NOT NULL;

-- ── 8. Campus column on events ───────────────────────────────
ALTER TABLE events ADD COLUMN IF NOT EXISTS campus text;

-- ============================================================
-- RLS Policies
-- NOTE: The service role key (used by admin API routes)
--       bypasses RLS entirely — admin writes always work.
--       These policies only affect the public anon key.
-- ============================================================

-- contact_messages: no public access
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- press_club_team: public read active members
ALTER TABLE press_club_team ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active team" ON press_club_team
  FOR SELECT USING (active = true);

-- clubs: public read active clubs
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active clubs" ON clubs
  FOR SELECT USING (active = true);

-- club_posts: public read published posts
ALTER TABLE club_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published posts" ON club_posts
  FOR SELECT USING (published = true);

-- honours: public read published achievements
ALTER TABLE honours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published honours" ON honours
  FOR SELECT USING (published = true);

-- term_digests: public read published digests
ALTER TABLE term_digests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published digests" ON term_digests
  FOR SELECT USING (published = true);
