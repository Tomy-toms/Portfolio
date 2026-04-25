# Actions SEO nécessitant une intervention manuelle

Ce fichier recense toutes les actions SEO qui ne peuvent pas être effectuées dans le code.  
Classer par priorité : les actions critiques d'abord.

---

## PRIORITÉ 1 — À faire le jour du lancement

### 1. Configurer Google Search Console

**Pourquoi :** Google Search Console est l'outil officiel pour soumettre ton site à l'indexation et surveiller ta présence dans les résultats de recherche. Sans ça, Google peut mettre des semaines à découvrir ton site.

**Étapes :**
1. Va sur https://search.google.com/search-console/
2. Clique sur "Ajouter une propriété"
3. Choisis "Préfixe d'URL" et entre `https://ton-domaine.fr`
4. Vérifie la propriété via l'une de ces méthodes :
   - **Méthode recommandée :** Ajouter un enregistrement DNS TXT chez ton registrar de domaine (OVH, Gandi, etc.)
   - Ou en uploadant un fichier HTML de vérification à la racine du projet dans le dossier `/public/`
5. Une fois vérifié, va dans **Sitemaps** → entre `https://ton-domaine.fr/sitemap.xml` → clique "Envoyer"
6. Va dans **Paramètres** → vérifie que la propriété est bien configurée

**Ce qu'il faut surveiller ensuite :**
- Onglet "Couverture" : pages indexées / erreurs
- Onglet "Performances" : requêtes qui génèrent des clics, CTR, positions
- Onglet "Core Web Vitals" : LCP, CLS, INP

---

### 2. Créer et optimiser la fiche Google Business Profile

**Pourquoi :** C'est le levier SEO local n°1. Sans fiche GBP, tu n'apparaîtras jamais dans le "Local Pack" (la carte Google avec les 3 résultats locaux en haut des SERP). C'est là que se joue la majorité du trafic local.

**Étapes :**
1. Va sur https://business.google.com
2. Clique sur "Gérer maintenant" ou "Ajouter votre entreprise"
3. Nom de l'entreprise : `Thomas Barthelemy — Développeur web`
4. Catégorie principale : **Concepteur de sites Web**
5. Catégories secondaires : Consultant en informatique, Services de marketing numérique
6. Adresse : Si tu ne veux pas afficher ton adresse personnelle (domicile), active le mode **"Zone de service"** et spécifie :
   - Alès
   - Nîmes
   - Gard (département)
   - France (pour le travail à distance)
7. Numéro de téléphone : `06 89 88 76 78`
8. Site web : `https://ton-domaine.fr`
9. Horaires : Lundi–Vendredi, 9h–18h
10. Description (750 caractères max) :

```
Développeur web freelance basé à Alès (Gard). Je crée des sites internet rapides, visibles sur Google et conçus pour convertir vos visiteurs en clients.

Sites vitrines pour artisans, professions libérales et TPE. Refontes de sites existants. Boutiques e-commerce. Outils métier sur mesure.

Intervention autour d'Alès, Nîmes, Uzès, Bagnols-sur-Cèze et dans tout le Gard. Disponible partout en France par visioconférence.

Devis gratuit. Livraison en 2 à 4 semaines. Un interlocuteur unique, sans sous-traitance.
```

11. Ajouter des **photos** :
    - Ta photo professionnelle (portrait)
    - Le logo du site
    - Captures d'écran de sites réalisés (dès que tu en as)
    - Photo de ton environnement de travail

12. Cliquer sur "Vérifier" — Google envoie un courrier postal avec un code à Alès (délai : 1–2 semaines) ou peut proposer une vérification par téléphone/email

**Important :** La cohérence NAP est critique. Le nom, l'adresse et le téléphone sur GBP doivent être IDENTIQUES à ceux du site :
- Nom : `Thomas Barthelemy`
- Téléphone : `06 89 88 76 78`
- Ville : `Alès`

---

### 3. Vérifier la variable d'environnement NEXT_PUBLIC_SITE_URL en production

**Pourquoi :** Le canonical, le sitemap, et tous les schemas JSON-LD utilisent cette variable. Si elle pointe vers `localhost:3000`, tout le SEO est cassé.

**Étapes :**
1. Dans ton tableau de bord Vercel → Settings → Environment Variables
2. Vérifier que `NEXT_PUBLIC_SITE_URL` est bien défini sur **ton domaine de production** : `https://ton-domaine.fr`
3. Vérifier aussi que `NEXT_PUBLIC_SITE_NAME` est défini (sinon le nom par défaut s'affiche)
4. Après tout changement de variable, redéployer le site

---

## PRIORITÉ 2 — Dans les 7 jours post-lancement

### 4. Créer les citations locales (annuaires)

**Pourquoi :** Les citations locales (ton NAP sur des annuaires tiers) sont un signal de confiance fort pour le SEO local. Plus ton NAP est cohérent et présent sur des sites d'autorité, plus Google te fait confiance.

**NAP à utiliser partout de manière identique :**
```
Nom : Thomas Barthelemy
Activité : Développeur web freelance
Adresse : Alès (30), Gard, France
Téléphone : 06 89 88 76 78
Site : https://ton-domaine.fr
```

**Annuaires à créer en priorité :**

| Annuaire | URL | Priorité | Gratuit ? |
|----------|-----|----------|-----------|
| PagesJaunes | pagesjaunes.fr/profil-pro | Critique | Oui |
| 118000.fr | 118000.fr/inscription | Haute | Oui |
| Kompass | kompass.com/fr/inscription | Haute | Oui (version basique) |
| Societe.com | (référencé automatiquement via SIRET) | — | Auto |
| Annuaire.fr | annuaire.fr | Moyenne | Oui |
| Yelp France | biz.yelp.fr | Moyenne | Oui |

**Annuaires spécialisés web/IT :**

| Annuaire | URL | Notes |
|----------|-----|-------|
| Codeur.com | codeur.com | Créer un profil freelance |
| Malt | malt.fr | ✅ Déjà présent — s'assurer que le profil est complet |
| Sortlist | sortlist.fr | Inscription gratuite |
| ComeUp | comeup.com | Profil freelance |

---

### 5. Vérifier la redirection `/` → `/fr` en production

**Pourquoi :** next-intl avec `localePrefix: "always"` doit rediriger les visiteurs de `/` vers `/fr`. Il faut s'assurer que c'est un redirect permanent (308/301), pas temporaire.

**Comment vérifier :**
```bash
curl -I https://ton-domaine.fr/
```
Le résultat doit montrer `HTTP/2 308` ou `HTTP/2 301` avec `Location: https://ton-domaine.fr/fr`.

Si c'est un 307 (temporaire), Google ne transférera pas tout le "link juice" des backlinks. Dans ce cas, contacter le support Vercel ou voir la doc next-intl pour forcer le 301.

---

### 6. Tester les Core Web Vitals

**Pourquoi :** Google intègre les CWV dans son algorithme de classement. LCP, CLS et INP mauvais = malus de positionnement.

**Outils à utiliser :**
1. **PageSpeed Insights** : https://pagespeed.web.dev — entre ton URL et analyse les scores Mobile ET Desktop
2. **Google Search Console** → Onglet "Core Web Vitals" (données réelles après 28 jours)

**Seuils cibles :**
- LCP (Largest Contentful Paint) : < 2.5 secondes
- CLS (Cumulative Layout Shift) : < 0.1
- INP (Interaction to Next Paint) : < 200 ms

**Actions si les scores sont mauvais :**
- LCP lent : optimiser l'image hero (si tu en ajoutes), ajouter `priority` prop sur la première image
- CLS élevé : vérifier que les polices ont `display: swap` (✅ déjà fait) et que les images animées ont des dimensions réservées
- INP lent : réduire la quantité de JS au premier chargement (Framer Motion est lourd)

---

### 7. Tester le rendu JSON-LD avec le Rich Results Test

**Pourquoi :** Vérifier que les schemas JSON-LD sont valides et éligibles aux rich snippets Google (FAQ, Business).

**Étapes :**
1. Va sur https://search.google.com/test/rich-results
2. Entre l'URL de ton site (version déployée)
3. Vérifie :
   - ✅ FAQPage détecté → rich snippets FAQ dans les SERP
   - ✅ LocalBusiness / ProfessionalService détecté
4. Corriger tout warning ou erreur signalé

---

### 8. Tester les balises Open Graph

**Pourquoi :** Vérifier que la prévisualisation sur WhatsApp, LinkedIn et Twitter est correcte.

**Outils :**
- Facebook / Meta : https://developers.facebook.com/tools/debug/
- LinkedIn : https://www.linkedin.com/post-inspector/
- Twitter : https://cards-dev.twitter.com/validator

**Ce que tu dois voir :** L'image og.png (1200×630px), le titre et la description de la page.

---

## PRIORITÉ 3 — Dans le premier mois

### 9. Implémenter Plausible Analytics (ou Umami)

**Pourquoi :** Sans analytics, impossible de mesurer le trafic, les sources, les pages vues. Indispensable pour piloter une stratégie SEO. Plausible et Umami sont RGPD-conformes, ne déposent pas de cookies, et sont exempts de bannière de consentement en France selon la CNIL.

**Option recommandée — Plausible Analytics :**
1. Va sur https://plausible.io → créer un compte (9€/mois, 30 jours d'essai gratuit)
2. Ajouter ton domaine
3. Installer le script dans `src/app/layout.tsx` :

```tsx
// Dans <head>, via next/script ou directement dans le layout :
<script
  defer
  data-domain="ton-domaine.fr"
  src="https://plausible.io/js/script.js"
/>
```

**Option gratuite — Umami (auto-hébergé sur Vercel) :**
1. Fork le repo : https://github.com/umami-software/umami
2. Déployer sur Vercel (gratuit)
3. Connecter ta base Supabase existante
4. Ajouter le script de tracking dans le layout

---

### 10. Publier de vrais projets en portfolio

**Pourquoi :** La section Réalisations affiche actuellement des projets placeholder. Google finit par comprendre que le contenu n'est pas réel. Des vrais projets avec des descriptions riches (client, problème résolu, résultats mesurables) sont un signal fort d'expertise et d'autorité.

**Structure recommandée pour chaque projet :**
- Titre : descriptif et avec mots-clés si possible ("Site vitrine — [type de client]")
- Tagline : le résultat concret ("Trafic organique +80% en 3 mois" ou "Livré en 18 jours")
- Technologies utilisées
- Lien live (si le client accepte)
- Catégorie : "Site vitrine", "E-commerce", "Refonte", "Outil métier"

**Comment les ajouter :** Via l'interface admin de ton site (`/admin`).

---

### 11. Créer les pages de services dédiées

**Pourquoi :** Actuellement, tout le contenu est sur une seule page. Pour se positionner sur des requêtes spécifiques comme "création site vitrine Alès" vs "refonte site web Alès", Google a besoin de pages séparées avec un contenu dédié.

**Pages à créer (dans cet ordre) :**

1. `/fr/creation-site-vitrine-ales`
   - H1 : "Création de site vitrine à Alès — pour artisans et TPE"
   - 600-800 mots sur le service site vitrine
   - Prix indicatif, délai, ce qui est inclus
   - FAQ locale (3-5 questions)
   - CTA contact

2. `/fr/developpeur-web-ales`
   - H1 : "Développeur web freelance à Alès (Gard)"
   - Page de présentation principale, la plus importante pour le SEO
   - Toutes les informations sur l'offre globale
   - Témoignages clients (à terme)

3. `/fr/refonte-site-web-ales`
   - H1 : "Refonte de site web à Alès — repartez sur de bonnes bases"

4. `/fr/creation-site-ecommerce-ales`
   - H1 : "Création de boutique en ligne à Alès"

**Note technique :** Ces pages nécessitent la création de nouveaux fichiers dans `src/app/[locale]/creation-site-vitrine-ales/page.tsx` etc.

---

### 12. Créer un blog (1 article par mois minimum)

**Pourquoi :** Le blog est le meilleur moyen de capturer la longue traîne et de construire l'autorité thématique sur "création de site web" dans le Gard. Google favorise les sites qui publient régulièrement du contenu utile.

**Sujets d'articles prioritaires (classés par volume potentiel) :**

1. "Combien coûte un site internet pour artisan en 2026 ? (Guide complet)"
2. "Développeur web vs agence web à Alès : comment choisir ?"
3. "Les 7 erreurs qui ruinent le SEO d'un site vitrine local"
4. "WordPress ou Next.js pour votre site vitrine ?"
5. "Comment choisir son développeur web freelance dans le Gard ?"
6. "Site web pour plombier à Alès : ce qu'il faut absolument inclure"
7. "Refonte de site web : les signes que votre site est dépassé"
8. "SEO local pour artisan : guide pratique 2026"

**Note technique :** Nécessite la création d'une section blog dans le projet (`/fr/blog/[slug]`).

---

### 13. Demander des témoignages clients

**Pourquoi :** Les avis Google (sur GBP) et les témoignages structurés (schema `Review`) sont des signaux de confiance très forts pour le SEO local et pour le taux de conversion.

**Actions :**
1. Dès qu'un client est livré et satisfait, lui envoyer un lien direct vers ta fiche Google Business Profile pour qu'il laisse un avis
2. Intégrer des témoignages sur le site (section dédiée ou cards dans About/Services)
3. Ajouter le schema `AggregateRating` dans le JSON-LD une fois que tu as 3+ avis Google

---

## PRIORITÉ 4 — Dans les 2-3 mois

### 14. Inscriptions dans les annuaires professionnels locaux

| Organisme | URL | Notes |
|-----------|-----|-------|
| CCI Gard | gard.cci.fr | Inscription annuaire prestataires |
| Chambre des Métiers du Gard | cm-gard.fr | Si applicable |
| Fédération Syntec Numérique | syntec-numerique.fr | Association professionnelle IT |

---

### 15. Stratégie de backlinks

**Actions progressives :**

**Mois 1-2 :**
- Compléter ton profil LinkedIn avec le lien vers ton site
- Ajouter ton site dans la section "Site web" de ta fiche Malt
- Partager le lien de ton site dans des groupes Facebook/LinkedIn de TPE/artisans du Gard

**Mois 3-4 :**
- Contacter des clients livrés pour qu'ils mettent un lien vers ton site depuis leur propre site ("Site réalisé par Thomas Barthelemy")
- Proposer un article invité sur un blog local (mairie, association de commerçants Alès)
- Inscription dans l'annuaire de la CCI Gard

**Mois 5-6 :**
- Proposer un article sur un blog web/SEO francophone ("Comment j'ai construit mon portfolio Next.js")
- Participer à des forums locaux ou des groupes d'entrepreneurs du Gard

---

## SUIVI SEO — Tableau de bord mensuel

Une fois le site lancé et Search Console configuré, vérifier chaque mois :

| Métrique | Où regarder | Objectif |
|----------|-------------|----------|
| Clics organiques | Search Console → Performances | +20% par mois |
| Position moyenne | Search Console → Performances | < 20 pour les mots-clés cibles |
| Pages indexées | Search Console → Couverture | Toutes les pages indexées |
| Core Web Vitals | Search Console → CWV | Tous au vert |
| Backlinks | Ahrefs Free / Ubersuggest | Croissance progressive |
| Avis Google | GBP | Répondre à chaque avis sous 24h |

---

## RAPPEL — Cohérence NAP (critique)

Le Name / Address / Phone doit être **identique** partout :

```
Nom : Thomas Barthelemy
Téléphone : 06 89 88 76 78 (ou +33 6 89 88 76 78 en international)
Ville : Alès (30), Gard, France
Site : https://ton-domaine.fr
Email : [ton email de contact]
```

Toute incohérence (ex: "Bartélémy" avec accent vs "Barthelemy" sans) est un signal négatif pour le SEO local.
