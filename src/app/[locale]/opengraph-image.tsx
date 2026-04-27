import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const alt = "Thomas Barthelemy — Développeur web freelance à Alès";

type Props = { params: Promise<{ locale: string }> };

export default async function OpenGraphImage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const isFr = locale === "fr";
  const role = isFr
    ? "Développeur web freelance à Alès"
    : "Freelance Web Developer based in Alès";
  const tagline = isFr
    ? "Sites rapides, visibles sur Google, livrés en 2 à 4 semaines."
    : "Fast, Google-friendly websites delivered in 2 to 4 weeks.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse 1000px 600px at 10% 0%, rgba(139,92,246,0.45), transparent 60%), radial-gradient(ellipse 800px 500px at 110% 100%, rgba(34,211,238,0.35), transparent 60%), #05070f",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            TB
          </div>
          <div style={{ fontSize: 24, color: "#c9d0e0", letterSpacing: "0.2em" }}>
            THOMAS BARTHELEMY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 1000,
            }}
          >
            {t("title")}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#c9d0e0",
              lineHeight: 1.3,
              maxWidth: 980,
            }}
          >
            {tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#99a3bd",
            fontSize: 22,
          }}
        >
          <span>{role}</span>
          <span style={{ color: "#22d3ee" }}>thomasbarthelemy.fr</span>
        </div>
      </div>
    ),
    size
  );
}
