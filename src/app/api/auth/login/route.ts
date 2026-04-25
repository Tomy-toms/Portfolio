import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  setSessionCookie,
  signSession,
  verifyPassword,
} from "@/lib/auth";
import { flattenErrors, loginSchema } from "@/lib/validators";

const ipAttempts = new Map<string, { count: number; reset: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 min — NOTE: in-memory, non partagé entre instances ; utiliser Redis/Upstash en multi-instance

function rateLimit(ip: string) {
  const now = Date.now();
  const entry = ipAttempts.get(ip);
  if (!entry || entry.reset < now) {
    ipAttempts.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= MAX_ATTEMPTS;
}

export async function POST(req: Request) {
  // x-real-ip est injecté par Vercel/proxies de confiance et non falsifiable par le client
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", fieldErrors: flattenErrors(parsed.error) },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // timing-safe fallback when user doesn't exist
  if (!user) {
    await hashPassword("dummy-to-equalize-timing");
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = await signSession({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  await setSessionCookie(token);

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
