# Supabase — SQL setup

Use this folder when you can't reach the Postgres port directly from your
current network (e.g. firewall blocks 5432/6543). Supabase's SQL Editor
runs over HTTPS/443 and works everywhere.

## Run it

1. Open your Supabase project → **SQL Editor** → **New query**.
2. Paste the contents of [`01_schema.sql`](./01_schema.sql) → **Run**.
3. Paste the contents of [`02_seed.sql`](./02_seed.sql) → **Run**.

Expected result at the bottom of step 2:

```
table_name | rows
-----------+-----
users      |    1
projects   |    6
messages   |    0
```

## Admin credentials

The seed creates one admin user:

| Email               | Password                     |
| ------------------- | ---------------------------- |
| `admin@example.com` | `change-me-in-production`    |

**Change it immediately.** Two ways:

```bash
# 1. Generate a new hash locally
node -e "require('bcryptjs').hash('MY_NEW_PASSWORD', 12).then(console.log)"
```

Then in Supabase SQL Editor:

```sql
UPDATE "User"
SET "passwordHash" = '<paste_new_hash_here>'
WHERE "email" = 'admin@example.com';
```

## Heads up — runtime connection

Applying the schema via SQL Editor only gets you past the **migration**
step. The Next.js app still needs to reach Postgres at runtime. If your
local network blocks outbound 5432/6543, your options are:

- **Deploy to Vercel** — egress is unrestricted there.
- **Use a different network** — home Wi-Fi / hotspot often works.
- **VPN** — any provider that doesn't filter Postgres ports.

Once connectivity is in place, update `.env` with the appropriate
Supabase connection string (Session Pooler recommended for dev,
Transaction Pooler with `?pgbouncer=true&connection_limit=1` for
serverless prod).

## Resetting

Re-running `01_schema.sql` drops and recreates all tables — you lose
every row, including projects and messages. The seed inserts use
`ON CONFLICT DO UPDATE`, so you can re-run `02_seed.sql` alone to reset
the sample data without wiping messages.
