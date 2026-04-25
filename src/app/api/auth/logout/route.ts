import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (origin && siteUrl && !origin.startsWith(siteUrl)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
