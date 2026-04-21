-- =============================================================
-- Portfolio — Seed
-- Paste AFTER 01_schema.sql in Supabase → SQL Editor → Run.
-- Idempotent: re-running updates existing rows (upsert via slug/email).
-- =============================================================

-- -------------------------------------------------------------
-- Admin user
--   email:    admin@example.com
--   password: change-me-in-production
-- The hash below was generated with bcryptjs (cost 12).
-- To change the password: run `node -e "require('bcryptjs').hash('YOUR_PASSWORD',12).then(console.log)"`
-- and paste the resulting hash in place of the string below.
-- -------------------------------------------------------------
INSERT INTO "User" ("id", "email", "passwordHash", "name", "role")
VALUES (
  'usr_admin_01',
  'admin@example.com',
  '$2a$12$6YISJIfC1zUxXmyY2/7wjuV/KNM1Vd5hljixhkYdEkHbg4ZFintNO',
  'Admin',
  'ADMIN'
)
ON CONFLICT ("email") DO UPDATE
SET "passwordHash" = EXCLUDED."passwordHash",
    "name"         = EXCLUDED."name",
    "role"         = EXCLUDED."role";

-- -------------------------------------------------------------
-- Sample projects (6)
-- -------------------------------------------------------------
INSERT INTO "Project" (
  "id", "slug", "title", "tagline", "description", "imageUrl",
  "liveUrl", "githubUrl", "tech", "category", "featured", "order", "published"
) VALUES
  (
    'prj_aurora_01',
    'aurora-analytics',
    'Aurora Analytics',
    'Real-time dashboards for product teams',
    'A real-time analytics platform with sub-second event ingestion, cohort analysis, and an SQL-optional query builder. Built with Next.js, ClickHouse, and WebSockets.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    'https://example.com',
    'https://github.com/',
    ARRAY['Next.js','TypeScript','ClickHouse','WebSockets','Tailwind']::TEXT[],
    'Web App',
    true, 1, true
  ),
  (
    'prj_prism_02',
    'prism-commerce',
    'Prism Commerce',
    'Headless storefront with a cinematic feel',
    'A headless e-commerce front-end with product storytelling, Shopify Storefront API, and scroll-driven scene transitions.',
    'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1600&q=80',
    'https://example.com',
    'https://github.com/',
    ARRAY['Next.js','Shopify','Framer Motion','GSAP','Stripe']::TEXT[],
    'E-commerce',
    true, 2, true
  ),
  (
    'prj_signal_03',
    'signal-crm',
    'Signal CRM',
    'A pipeline tool teams actually enjoy',
    'Opinionated CRM with drag-and-drop pipelines, AI-summarized call notes, and a keyboard-first command palette.',
    'https://images.unsplash.com/photo-1529336953128-a85760f58cb5?auto=format&fit=crop&w=1600&q=80',
    'https://example.com',
    'https://github.com/',
    ARRAY['Next.js','tRPC','Prisma','Postgres','OpenAI']::TEXT[],
    'SaaS',
    true, 3, true
  ),
  (
    'prj_nomad_04',
    'nomad-journal',
    'Nomad Journal',
    'MDX-powered travel log with maps',
    'A custom blog platform with MDX, Mapbox story maps, and edge-cached OG images.',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=1600&q=80',
    'https://example.com',
    'https://github.com/',
    ARRAY['Next.js','MDX','Mapbox','Edge Functions']::TEXT[],
    'Content',
    false, 4, true
  ),
  (
    'prj_tempo_05',
    'tempo-booking',
    'Tempo Booking',
    'Calendly-style scheduling for studios',
    'A booking platform for music studios with resource scheduling, Stripe deposits, and a public embedded widget.',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80',
    'https://example.com',
    'https://github.com/',
    ARRAY['Next.js','Node','Postgres','Stripe']::TEXT[],
    'SaaS',
    false, 5, true
  ),
  (
    'prj_orbit_06',
    'orbit-docs',
    'Orbit Docs',
    'Open-source docs engine',
    'A developer-docs starter with MDX, algolia search, dark-mode code blocks, and CLI generators.',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1600&q=80',
    'https://example.com',
    'https://github.com/',
    ARRAY['Next.js','MDX','Algolia','Shiki']::TEXT[],
    'Open Source',
    false, 6, true
  )
ON CONFLICT ("slug") DO UPDATE
SET "title"       = EXCLUDED."title",
    "tagline"     = EXCLUDED."tagline",
    "description" = EXCLUDED."description",
    "imageUrl"    = EXCLUDED."imageUrl",
    "liveUrl"     = EXCLUDED."liveUrl",
    "githubUrl"   = EXCLUDED."githubUrl",
    "tech"        = EXCLUDED."tech",
    "category"    = EXCLUDED."category",
    "featured"    = EXCLUDED."featured",
    "order"       = EXCLUDED."order",
    "published"   = EXCLUDED."published";

-- -------------------------------------------------------------
-- Sanity checks
-- -------------------------------------------------------------
SELECT 'users' AS table_name, COUNT(*) AS rows FROM "User"
UNION ALL
SELECT 'projects',  COUNT(*) FROM "Project"
UNION ALL
SELECT 'messages',  COUNT(*) FROM "ContactMessage";
