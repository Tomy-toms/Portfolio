import { NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  setSessionCookie,
  signSession,
  verifyPassword,
} from "@/lib/auth";
import { flattenErrors, loginSchema } from "@/lib/validators";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  const ip = getClientIp(req);

  if (!(await rateLimit("login", ip, MAX_ATTEMPTS, WINDOW_MS))) {
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

  let user: User | null = null;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (e) {
    console.error("[auth:login] db lookup failed", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }

  // Timing-safe fallback when the user doesn't exist.
  if (!user) {
    await hashPassword("dummy-to-equalize-timing");
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
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
