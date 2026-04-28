import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

function sameOrigin(origin: string | null, siteUrl: string | undefined) {
  if (!origin || !siteUrl) return false;
  try {
    return new URL(origin).origin === new URL(siteUrl).origin;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  // Reject cross-origin POSTs. We allow same-origin and missing-origin (e.g. tests)
  // when no siteUrl is configured. In production, NEXT_PUBLIC_SITE_URL is always set.
  if (siteUrl && origin && !sameOrigin(origin, siteUrl)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
