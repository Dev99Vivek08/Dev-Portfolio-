-- ============================================================
-- DEV.OS Portfolio — Supabase Schema
-- Run this in your Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Portfolio Config ─────────────────────────────────────────────────────────
-- Stores hero, about, social, SEO as a single row
CREATE TABLE IF NOT EXISTS portfolio_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hero jsonb DEFAULT '{}'::jsonb,
  about jsonb DEFAULT '{}'::jsonb,
  social jsonb DEFAULT '{}'::jsonb,
  seo jsonb DEFAULT '{}'::jsonb,
  terminal_password text DEFAULT '9950',
  resume_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  tags text[] DEFAULT '{}',
  image_url text,
  github_url text,
  live_url text,
  category text DEFAULT 'Other',
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Skills ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  category text DEFAULT 'Other',
  icon text DEFAULT '💻',
  sort_order integer DEFAULT 0
);

-- ─── Blog Posts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE,
  content text,
  excerpt text,
  cover_url text,
  tags text[] DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Storage Buckets ──────────────────────────────────────────────────────────
-- Create in Supabase dashboard: Storage > New Bucket
-- Buckets needed: "avatars", "projects", "resume"
-- Set both to Public

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Allow public read, authenticated write

ALTER TABLE portfolio_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read portfolio_config" ON portfolio_config FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read published blog_posts" ON blog_posts FOR SELECT USING (status = 'published');

-- Authenticated full access
CREATE POLICY "Auth write portfolio_config" ON portfolio_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- ─── Seed default data ────────────────────────────────────────────────────────
INSERT INTO portfolio_config (hero, about, social, seo) VALUES (
  '{
    "name": "Alex Chen",
    "role": "Full Stack Developer",
    "tagline": "Building the future, one commit at a time.",
    "subtitle": "Crafting digital experiences that push the boundaries of what''s possible.",
    "ctaPrimary": "View Projects",
    "ctaSecondary": "Open Terminal"
  }'::jsonb,
  '{
    "bio": "I am a passionate full-stack developer with 5+ years of experience.",
    "location": "San Francisco, CA",
    "email": "alex@devportfolio.io",
    "availability": "Open to opportunities"
  }'::jsonb,
  '{
    "github": "https://github.com",
    "twitter": "https://twitter.com",
    "linkedin": "https://linkedin.com",
    "email": "alex@devportfolio.io"
  }'::jsonb,
  '{
    "title": "DEV.OS Portfolio",
    "description": "Premium futuristic developer portfolio"
  }'::jsonb
);

INSERT INTO projects (title, description, tags, github_url, live_url, category, featured, sort_order) VALUES
  ('NeuralDash', 'AI-powered analytics dashboard with real-time data visualization.', ARRAY['React','Python','TensorFlow'], 'https://github.com', 'https://example.com', 'AI', true, 1),
  ('CipherChat', 'End-to-end encrypted messaging with zero-knowledge architecture.', ARRAY['Next.js','WebRTC','Node.js'], 'https://github.com', 'https://example.com', 'Security', true, 2),
  ('VoxForge', '3D audio visualization using WebAudio API.', ARRAY['Three.js','WebAudio','GSAP'], 'https://github.com', 'https://example.com', 'Creative', false, 3),
  ('OrbitalDB', 'Distributed database management with visual schema design.', ARRAY['Rust','PostgreSQL','React'], 'https://github.com', 'https://example.com', 'Backend', false, 4);

INSERT INTO skills (name, category, icon, sort_order) VALUES
  ('React / Next.js', 'Frontend', '⚛️', 1),
  ('TypeScript', 'Language', '📘', 2),
  ('Node.js', 'Backend', '🟢', 3),
  ('Python', 'Language', '🐍', 4),
  ('PostgreSQL', 'Database', '🗄️', 5),
  ('Redis', 'Database', '🔴', 6),
  ('Docker', 'DevOps', '🐳', 7),
  ('AWS', 'Cloud', '☁️', 8),
  ('GraphQL', 'API', '◈', 9),
  ('Three.js', '3D/WebGL', '🎮', 10),
  ('Framer Motion', 'Animation', '✨', 11),
  ('Tailwind CSS', 'Frontend', '💨', 12);
