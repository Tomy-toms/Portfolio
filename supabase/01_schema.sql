-- =============================================================
-- Portfolio — Schema
-- Paste this into Supabase → SQL Editor → New query → Run.
-- Idempotent: safe to re-run (drops existing tables first).
-- =============================================================

DROP TABLE IF EXISTS "ContactMessage" CASCADE;
DROP TABLE IF EXISTS "Project" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TYPE  IF EXISTS "Role"           CASCADE;

-- Role enum ---------------------------------------------------
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- User --------------------------------------------------------
CREATE TABLE "User" (
    "id"           TEXT           NOT NULL,
    "email"        TEXT           NOT NULL,
    "passwordHash" TEXT           NOT NULL,
    "name"         TEXT,
    "role"         "Role"         NOT NULL DEFAULT 'ADMIN',
    "createdAt"    TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Project -----------------------------------------------------
CREATE TABLE "Project" (
    "id"          TEXT           NOT NULL,
    "slug"        TEXT           NOT NULL,
    "title"       TEXT           NOT NULL,
    "tagline"     TEXT           NOT NULL,
    "description" TEXT           NOT NULL,
    "imageUrl"    TEXT           NOT NULL,
    "liveUrl"     TEXT,
    "githubUrl"   TEXT,
    "tech"        TEXT[]         NOT NULL DEFAULT ARRAY[]::TEXT[],
    "category"    TEXT           NOT NULL DEFAULT 'Web',
    "featured"    BOOLEAN        NOT NULL DEFAULT false,
    "order"       INTEGER        NOT NULL DEFAULT 0,
    "published"   BOOLEAN        NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- ContactMessage ---------------------------------------------
CREATE TABLE "ContactMessage" (
    "id"        TEXT         NOT NULL,
    "name"      TEXT         NOT NULL,
    "email"     TEXT         NOT NULL,
    "message"   TEXT         NOT NULL,
    "ip"        TEXT,
    "userAgent" TEXT,
    "read"      BOOLEAN      NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- Auto-update updatedAt on UPDATE ----------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_set_updated_at
  BEFORE UPDATE ON "User"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER project_set_updated_at
  BEFORE UPDATE ON "Project"
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
