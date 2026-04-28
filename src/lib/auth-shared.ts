// Edge-runtime safe primitives shared between `middleware.ts` (Edge) and
// `lib/auth.ts` (Node). Only depends on `jose` — DO NOT import `next/headers`,
// `bcryptjs`, or `@/lib/prisma` here.

import { jwtVerify, type JWTPayload } from "jose";

export const AUTH_COOKIE = "portfolio_session";
export const ALG = "HS256";

export type SessionPayload = JWTPayload & {
  sub: string;
  email: string;
  role: "ADMIN" | "EDITOR";
};

export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET env var must be set and at least 32 characters long"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function verifyToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: [ALG],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
