## Portfolio — Thomas Barthelemy

Personal site for my freelance web development activity, based in Alès (France).
Public site in FR / EN, plus a small admin to manage projects and the contact-form inbox.

### Stack

- Next.js 14 (App Router, React Server Components) + TypeScript
- Tailwind CSS + Framer Motion
- next-intl — FR / EN sub-path routing
- Prisma + PostgreSQL (Supabase in production)
- JWT sessions (`jose`) + bcrypt for the admin

### Local setup

```bash
npm install
cp .env.example .env
# Fill DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD.

npx prisma migrate dev --name init   # or, for a quick push: npm run db:push
npm run db:seed                      # creates admin user + sample projects
npm run dev
```

Public site: http://localhost:3000 — admin: http://localhost:3000/admin/login.

### Environment variables

| Key | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Postgres connection string |
| `JWT_SECRET` | yes | ≥ 32 chars, signs the admin session cookie |
| `ADMIN_EMAIL` | seed only | Admin login created by `db:seed` |
| `ADMIN_PASSWORD` | seed only | Admin password (bcrypt-hashed at seed) |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL for sitemap + OG tags |
| `NEXT_PUBLIC_SITE_NAME` | optional | Brand name shown in metadata |
| `NEXT_PUBLIC_CONTACT_EMAIL` | optional | Public contact email |

Generate a JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### Scripts

| Script | Action |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + `next build` |
| `npm start` | Production server |
| `npm run lint` | ESLint |
| `npm run db:push` | Push schema without migration |
| `npm run db:migrate` | Create + apply a dev migration |
| `npm run db:seed` | Seed admin + sample projects |
| `npm run db:studio` | Prisma Studio |

### Project layout

```
prisma/        Postgres schema (User, Project, ContactMessage) + seed
messages/      i18n strings (fr.json, en.json)
src/
  app/
    [locale]/  Public site (home, legal, privacy)
    admin/     Protected dashboard (projects + messages CRUD)
    api/       Auth, contact form, projects, messages routes
  components/  Section components (Hero, Services, Projects, …)
  lib/         Prisma singleton, auth helpers, validators, site config
  i18n/        next-intl routing + request setup
  middleware.ts JWT-protects /admin/*
```

### Deploy

- App on Vercel (Next.js native), DB on Supabase or Neon — connection string into `DATABASE_URL`.
- `postinstall` runs `prisma generate`. Run `npx prisma migrate deploy` once to apply migrations on the prod database.
- Set the same env vars in the Vercel project settings.

### Editing content

- Site copy (FR + EN): `messages/fr.json`, `messages/en.json`.
- Brand name, social links, contact email: `src/lib/site.ts`.
- Colors: `tailwind.config.ts → theme.extend.colors`.
- Projects: managed live via the admin (`/admin`).

### Security notes

- Passwords hashed with bcrypt (cost 12).
- Sessions signed HS256, cookie is `HttpOnly`, `SameSite=Lax`, `Secure` in production.
- `middleware.ts` guards every `/admin/*` route in addition to in-handler session checks.
- All inputs run through Zod; honeypot field + per-IP rate-limit on `/api/contact` and `/api/auth/login`.
- Security headers set in `next.config.mjs`.

---

© Thomas Barthelemy. Source code is not licensed for reuse.
