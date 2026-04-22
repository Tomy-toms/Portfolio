-- =============================================================
-- Portfolio — Reset projects with business-oriented fictional cases
-- Run in Supabase → SQL Editor → Run.
-- Deletes the old sample projects and inserts 4 realistic business cases.
-- =============================================================

-- Remove previous seed projects
DELETE FROM "Project" WHERE "slug" IN (
  'aurora-analytics', 'prism-commerce', 'signal-crm',
  'nomad-journal', 'tempo-booking', 'orbit-docs'
);

-- New business-oriented projects
INSERT INTO "Project" (
  "id", "slug", "title", "tagline", "description", "imageUrl",
  "liveUrl", "githubUrl", "tech", "category", "featured", "order", "published"
) VALUES
  (
    'prj_moulin_01',
    'le-moulin-dore',
    'Le Moulin Doré',
    '+2 500 visiteurs/mois et 40 commandes en ligne par semaine',
    'Boulangerie artisanale parisienne. Site vitrine avec commande en ligne (click & collect), carte des produits, localisation et mise en avant des nouveautés saisonnières. Référencement local optimisé pour apparaître en première page sur "boulangerie Paris 11e".',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
    null,
    null,
    ARRAY['Next.js','Stripe','SEO local','Mobile-first']::TEXT[],
    'Site Vitrine',
    true, 1, true
  ),
  (
    'prj_cabinet_02',
    'cabinet-martin',
    'Cabinet Martin',
    '60 % des nouveaux patients prennent RDV en ligne',
    'Cabinet de kinésithérapie à Lyon. Site de confiance avec prise de rendez-vous en ligne, présentation des thérapeutes, pathologies traitées et conseils patients. Intégration calendrier synchronisé avec Google Agenda.',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1600&q=80',
    null,
    null,
    ARRAY['Next.js','Prise de RDV','Google Calendar','RGPD']::TEXT[],
    'Refonte',
    true, 2, true
  ),
  (
    'prj_atelier_03',
    'atelier-lumiere',
    'Atelier Lumière',
    '12 demandes de devis/mois vs 2 avant la refonte',
    'Menuiserie artisanale spécialisée dans les aménagements sur mesure. Portfolio photo immersif des réalisations, formulaire de devis détaillé avec upload de plans, témoignages clients. Refonte complète d''un ancien site WordPress lent et peu visible.',
    'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&w=1600&q=80',
    null,
    null,
    ARRAY['Next.js','Formulaire avancé','Upload','SEO']::TEXT[],
    'Refonte',
    false, 3, true
  ),
  (
    'prj_bistro_04',
    'bistro-saison',
    'Bistro Saison',
    'Carte en ligne mise à jour par le chef en 2 clics',
    'Restaurant de quartier avec une carte qui change toutes les semaines. Site vitrine + interface d''administration ultra-simple pour que le chef mette à jour le menu sans passer par un développeur. Réservations par formulaire et intégration TheFork.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    null,
    null,
    ARRAY['Next.js','CMS simple','Formulaire','Réservation']::TEXT[],
    'Site Vitrine',
    false, 4, true
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

-- Sanity check
SELECT COUNT(*) AS project_count FROM "Project";
