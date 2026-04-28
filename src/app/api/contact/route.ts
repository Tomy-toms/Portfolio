import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema, flattenErrors } from "@/lib/validators";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const MAX_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  const ip = getClientIp(req);

  if (!(await rateLimit("contact", ip, MAX_PER_HOUR, WINDOW_MS))) {
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

  // Honeypot: bots fill the hidden "website" field. Pretend success so they don't retry.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const userAgent = req.headers.get("user-agent") ?? undefined;
  // RGPD: IP + userAgent stored on legitimate-interest basis (anti-spam).
  // Auto-delete messages after 90 days (TODO: cron / scheduled job).

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
