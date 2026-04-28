import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  ALG,
  AUTH_COOKIE,
  getJwtSecret,
  verifyToken,
  type SessionPayload,
} from "./auth-shared";

export type { SessionPayload } from "./auth-shared";
export const AUTH_COOKIE_NAME = AUTH_COOKIE;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function signSession(payload: Omit<SessionPayload, "iat" | "exp">) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getJwtSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  return verifyToken(token);
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(AUTH_COOKIE);
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  return verifyToken(token);
}

export function getSessionTokenFromRequest(req: NextRequest): string | undefined {
  return req.cookies.get(AUTH_COOKIE)?.value;
}

type AdminResult =
  | { session: SessionPayload; error: null }
  | { session: null; error: NextResponse };

export async function requireAdmin(): Promise<AdminResult> {
  const session = await getSessionFromCookies();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (session.role !== "ADMIN") {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session, error: null };
}
