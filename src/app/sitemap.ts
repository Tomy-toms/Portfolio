import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { routing } from "@/i18n/routing";

const STATIC_PAGES = [
  { path: "", changeFrequency: "weekly" as const, priority: { default: 1.0, other: 0.9 } },
  { path: "/legal", changeFrequency: "monthly" as const, priority: { default: 0.3, other: 0.3 } },
  { path: "/privacy", changeFrequency: "monthly" as const, priority: { default: 0.3, other: 0.3 } },
];

const LAST_MODIFIED = new Date("2026-04-25");

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of STATIC_PAGES) {
    for (const locale of routing.locales) {
      const isDefault = locale === routing.defaultLocale;
      entries.push({
        url: `${site.url}/${locale}${page.path}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: page.changeFrequency,
        priority: isDefault ? page.priority.default : page.priority.other,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${site.url}/${l}${page.path}`])
          ),
        },
      });
    }
  }

  return entries;
}
