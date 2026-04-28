# HANDOFF — Reprise à la maison

> Ce fichier est temporaire. Une fois les 3 actions ci-dessous terminées, supprime-le :
> ```bash
> git rm HANDOFF.md && git commit -m "chore: remove HANDOFF" && git push
> ```

Audit qualité + refactor Sprint 1→5 effectués sur le poste Blachère le **2026-04-28**. Tout est commit-ready (typecheck ✓, lint ✓, 39 tests ✓, i18n parity ✓ 164 clés). Trois actions restantes nécessitent ton réseau perso (firewall employeur bloque Postgres + tu n'as pas tes credentials Upstash sur le poste pro).

---

## ⚠️ Avant tout — vérifier que `.env` n'est pas dans git

```bash
git ls-files | grep -E "^\.env$"
```

- **Sortie vide** = OK, `.env` ignoré, tu peux pusher.
- **Sortie = `.env`** = STOP. Le fichier contient ton mot de passe Supabase + JWT secret. Fais :
  ```bash
  git rm --cached .env
  git commit -m "chore: untrack .env"
  ```
  Puis **régénère immédiatement** :
  - JWT secret : `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`
  - Mot de passe Supabase : Supabase dashboard → Settings → Database → Reset password

---

## 1. 🟥 Index Prisma — appliquer en base (5 min)

### Pourquoi
Le schéma déclare 3 nouveaux index pour accélérer les requêtes principales :

| Table | Index | Effet |
|---|---|---|
| `Project` | `(published, featured, order)` | Évite le full-scan sur le rendu de la home (`getPublishedProjects`). |
| `ContactMessage` | `(read, createdAt)` | Liste admin des messages non-lus en haut sans scan. |
| `ContactMessage` | `(createdAt)` | Tri général /admin/messages. |

C'est non-destructif (ajout d'index = aucune perte de données).

### Commande
```bash
npx prisma db push
```

### Validation
- Sortie attendue : `🚀 Your database is now in sync with your Prisma schema.`
- Sur Supabase → Table Editor → `Project` → onglet **Indexes** : tu dois voir un index dont le nom contient `published_featured_order`. Idem sur `ContactMessage` (`read_createdAt`, `createdAt`).

---

## 2. 🟧 Upstash rate-limit — créer le compte (15 min, à faire avant mise en prod publique)

### Pourquoi
Aujourd'hui le rate-limit (`5 messages/h` côté contact, `5 tentatives/15min` côté login) tient en `Map` JavaScript en mémoire. Sur Vercel serverless, **chaque instance a sa propre Map**. Conséquence : un attaquant qui fait tourner 10 instances en parallèle a 50 tentatives, pas 5. **C'est inopérant en prod.**

Upstash = Redis serverless gratuit (10 000 commandes/jour offertes, large pour ton trafic). Le compteur devient global.

J'ai préparé `src/lib/rate-limit.ts` pour que **un seul fichier change** quand tu auras les credentials.

### Étapes
1. Compte gratuit sur **[upstash.com](https://upstash.com)** (Google login).
2. **Redis → Create Database** → région `eu-west-1` Frankfurt (proche d'Alès).
3. Sur la page de la base, copie :
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Ajoute-les dans :
   - `.env` local
   - **Vercel** → Project Settings → Environment Variables (les 3 environnements : Production, Preview, Development)
5. Installe le client :
   ```bash
   npm i @upstash/ratelimit @upstash/redis
   ```
6. Remplace **tout le contenu** de `src/lib/rate-limit.ts` par :

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const limiters = new Map<string, Ratelimit>();

function getLimiter(key: string, max: number, windowMs: number) {
  const cacheKey = `${key}:${max}:${windowMs}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowMs} ms`),
      prefix: `rl:${key}`,
      analytics: false,
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

export async function rateLimit(
  key: string,
  ip: string,
  max: number,
  windowMs: number
): Promise<boolean> {
  const { success } = await getLimiter(key, max, windowMs).limit(ip);
  return success;
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
```

7. **Important** : `rateLimit()` devient `async`. Adapte les 2 appels :

   - `src/app/api/contact/route.ts` ligne ~13 :
     ```ts
     if (!(await rateLimit("contact", ip, MAX_PER_HOUR, WINDOW_MS))) {
     ```
   - `src/app/api/auth/login/route.ts` ligne ~20 :
     ```ts
     if (!(await rateLimit("login", ip, MAX_ATTEMPTS, WINDOW_MS))) {
     ```

8. Vérifie : `npm run lint && npx tsc --noEmit && npm test`.

### Validation
- En local : envoie 6 messages depuis le formulaire contact en moins d'une heure → le 6ᵉ doit retourner `429`.
- Sur le dashboard Upstash → Data Browser : tu vois les clés `rl:contact:<ip>` et `rl:login:<ip>` apparaître.
- En prod : depuis 2 réseaux différents (4G + WiFi) → le compteur doit additionner les deux.

---

## 3. 🟨 Push GitHub (10 min)

### Pourquoi
- **Backup** (un SSD qui lâche = tu perds tout, c'est ton seul exemplaire).
- **Crédibilité** : ton portfolio mentionne `github.com/Tomy-toms` dans la nav et le contact. Si un prospect clique et tombe sur un compte vide → mauvais signal.
- **Déploiement Vercel** : Vercel se branche sur le repo pour build à chaque push.

### Étapes
1. Crée le repo `portfolio` sur GitHub (privé d'abord, tu pourras passer en public quand tu seras prêt).
2. ```bash
   cd ~/path/to/Portfolio
   git remote add origin git@github.com:Tomy-toms/portfolio.git
   git push -u origin main
   ```

### Validation
- `git push` termine sans erreur.
- `https://github.com/Tomy-toms/portfolio` affiche le code + le README en page d'accueil.

---

## 4. ✅ Avant de mettre en ligne (Vercel)

Une fois les 3 actions ci-dessus faites :

1. Sur Vercel → **Add New Project** → import depuis GitHub → sélectionne `portfolio`.
2. Variables d'environnement à coller (toutes en Production + Preview + Development) :
   ```
   DATABASE_URL=...                    (depuis Supabase)
   JWT_SECRET=...                      (le tien, ≥32 chars)
   NEXT_PUBLIC_SITE_URL=https://thomasbarthelemy.fr  (ton vrai domaine)
   NEXT_PUBLIC_SITE_NAME=Thomas Barthelemy — Développeur web à Alès
   NEXT_PUBLIC_CONTACT_EMAIL=ibarthelemythomas@gmail.com  (ou ton alias pro)
   ADMIN_EMAIL=...                     (uniquement pour le seed initial)
   ADMIN_PASSWORD=...                  (idem)
   UPSTASH_REDIS_REST_URL=...          (étape 2)
   UPSTASH_REDIS_REST_TOKEN=...        (étape 2)
   ```
3. Build command : `npm run build` (par défaut).
4. **Avant de déployer pour de vrai**, ajoute le domaine custom (`thomasbarthelemy.fr`) → Vercel te donne la config DNS à coller chez ton registrar.
5. Une fois déployé : ouvre `https://ton-domaine.fr/admin/login` → connecte-toi avec `ADMIN_EMAIL` / `ADMIN_PASSWORD` → ajoute tes vrais projets (le seed n'en crée plus aucun, c'est volontaire).
6. Vérifie sur Search Console (`search.google.com/search-console`) : soumets `sitemap.xml` et demande l'indexation de `/fr`.

---

## Récap rapide à cocher

- [ ] `.env` non tracké (vérifié avant push)
- [ ] `npx prisma db push` → indexes créés
- [ ] Compte Upstash + variables d'env locales et Vercel
- [ ] `lib/rate-limit.ts` swappé + 2 `await` ajoutés
- [ ] `npm test && npm run lint && npx tsc --noEmit` tous verts
- [ ] Repo GitHub créé + `git push -u origin main`
- [ ] Projet Vercel branché, env vars copiées
- [ ] Domaine custom configuré
- [ ] Premier login admin OK + projets ajoutés via /admin
- [ ] Search Console : sitemap soumis
- [ ] `git rm HANDOFF.md` une fois tout fait

---

## Si tu te retrouves bloqué

Relance Claude Code dans ce dossier et dis "j'ai un souci sur l'étape N du HANDOFF". Le repo contient toute la mémoire conversation (via `.claude/` qui est lui-même gitignoré, mais Claude relira le code en place).

Bon courage pour la finalisation 🛠
