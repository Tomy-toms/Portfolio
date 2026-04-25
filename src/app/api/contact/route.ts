import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema, flattenErrors } from "@/lib/validators";

const ipAttempts = new Map<string, { count: number; reset: number }>();
const MAX_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000; // NOTE: in-memory, non partagé entre instances ; utiliser Redis/Upstash en multi-instance

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = ipAttempts.get(ip);
  if (!entry || entry.reset < now) {
    ipAttempts.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= MAX_PER_HOUR;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Slow down — you've sent too many messages recently." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", fieldErrors: flattenErrors(parsed.error) },
      { status: 400 }
    );
  }

  // Honeypot: bots fill hidden "website" field
  if (parsed.data.website && parsed.data.website.length > 0) {
    // Pretend success so bots don't retry
    return NextResponse.json({ ok: true });
  }

  const userAgent = req.headers.get("user-agent") ?? undefined;
  // RGPD : IP et userAgent collectés sur base d'intérêt légitime (anti-spam).
  // Prévoir une suppression automatique des messages après 90 jours.

  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        ip,
        userAgent,
      },
    });
  } catch (e) {
    console.error("[contact] persist failed", e);
    return NextResponse.json(
      { error: "Could not save message. Please email instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
