# Portfolio — Next.js · Tailwind · Framer Motion · Prisma

A production-ready, design-forward developer portfolio.

- **Frontend:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Next.js route handlers (Node runtime), Prisma, PostgreSQL
- **Auth:** JWT sessions (signed with `jose`), bcrypt password hashing, HTTP-only cookies
- **SEO:** metadata API, sitemap/robots, JSON-LD (Person), OpenGraph/Twitter
- **Wow:** custom cursor, scroll progress, animated gradient background, gradient text, glass UI, reveal-on-scroll, parallax hero

## Quick start

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env
# Edit .env — at minimum set DATABASE_URL, JWT_SECRET,
# ADMIN_EMAIL, ADMIN_PASSWORD.

# 3. Create the database schema
npx prisma migrate dev --name init
# (or for a one-shot push without migrations:)
# npm run db:push

# 4. Seed admin user + sample projects
npm run db:seed

# 5. Run the dev server
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin/login for the dashboard.

## Environment variables

| Key | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | ✓ | Postgres connection string |
| `JWT_SECRET` | ✓ | ≥ 32 chars — used to sign session cookies |
| `ADMIN_EMAIL` | seed only | Admin login email created by `db:seed` |
| `ADMIN_PASSWORD` | seed only | Admin login password (bcrypt-hashed at seed) |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL used for OG tags + sitemap |
| `NEXT_PUBLIC_SITE_NAME` | optional | Brand shown in metadata |
| `NEXT_PUBLIC_CONTACT_EMAIL` | optional | Contact link email |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

## Free hosting stack

- **Database:** Supabase (free tier) or Neon — both give a Postgres connection string that plugs straight into `DATABASE_URL`.
- **App:** Vercel (Next.js native) — set the same env vars in the project settings.
- **Images:** remote Unsplash URLs are allowed via `next.config.mjs → images.remotePatterns`. Add your own hosts there.

### Deploy to Vercel

1. Push this repo to GitHub.
2. Import in Vercel, set env vars.
3. Add `prisma migrate deploy` to a build hook (or run once via `npx prisma migrate deploy`) — `postinstall` already runs `prisma generate`.

## Project structure

```
prisma/
  schema.prisma         Postgres schema (User, Project, ContactMessage)
  seed.ts               Upserts admin + sample projects
src/
  app/
    layout.tsx          Root layout, metadata, fonts, JSON-LD
    page.tsx            Home (async, reads projects from DB)
    globals.css         Design tokens + Tailwind layers
    sitemap.ts / robots.ts
    api/
      auth/login        POST — bcrypt verify + JWT cookie, rate-limited
      auth/logout       POST — clears cookie
      auth/me           GET — current session
      contact           POST — zod validation, honeypot, rate-limit, persist
      projects          GET/POST — list + create (auth required for POST)
      projects/[id]     GET/PATCH/DELETE — read + auth-guarded mutations
      messages          GET — admin inbox
      messages/[id]     PATCH/DELETE — read toggle / delete
    admin/
      login             Public login page
      layout.tsx        Protected shell (session-aware header)
      page.tsx          Projects CRUD dashboard
      messages          Contact messages inbox
  components/           Nav, Hero, About, Projects, Skills, Experience,
                        Contact, Footer, CustomCursor, ScrollProgress,
                        AnimatedBackground, SectionReveal, JsonLd
  lib/
    prisma.ts           Prisma singleton
    auth.ts             JWT sign/verify + cookie helpers + bcrypt
    validators.ts       Zod schemas (login, contact, project)
    utils.ts            cn(), slugify()
    site.ts             Site-wide config (nav, skills, experience, social)
  middleware.ts         Protects /admin/** via JWT
```

## Security

- Passwords hashed with bcrypt (cost 12).
- Sessions signed HS256 (JWT_SECRET required ≥ 32 chars); cookie is `HttpOnly`, `SameSite=Lax`, `Secure` in prod.
- Middleware guards every `/admin/*` route server-side (defense in depth in addition to session checks in handlers).
- All POST/PATCH input runs through Zod; known error codes (`P2002`, `P2025`) produce friendly messages instead of leaking internals.
- Honeypot field + in-memory per-IP rate limiting on `/api/contact` and `/api/auth/login`. Swap for Upstash Redis if you run multi-instance.
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`) set in `next.config.mjs`.
- SSRF / XSS: Next's JSX auto-escapes, `dangerouslySetInnerHTML` is only used for the JSON-LD payload we control.

## Performance

- `next/image` with AVIF/WebP formats and remote patterns.
- Google fonts loaded via `next/font` (zero layout shift).
- `optimizePackageImports` enabled for `framer-motion` and `lucide-react`.
- Home page is RSC; only interactive sections are client components.
- `revalidate = 60` on the home page keeps the DB off the critical path.
- Reduced-motion preference respected throughout.

## Customising

- **Your content:** edit `src/lib/site.ts` (nav, bio, skills, experience, social links).
- **Your brand:** tweak colors in `tailwind.config.ts → theme.extend.colors`.
- **New sections:** create a component, import it in `src/app/page.tsx`.
- **Extra models:** add them to `prisma/schema.prisma`, run `npx prisma migrate dev`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | `prisma generate` + `next build` |
| `npm start` | Production server |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run db:push` | Push schema without migrations |
| `npm run db:migrate` | Create + apply a dev migration |
| `npm run db:seed` | Upsert admin + sample projects |
| `npm run db:studio` | Open Prisma Studio |

## License

MIT — do whatever you like. If you ship something cool, a link back is always appreciated.
