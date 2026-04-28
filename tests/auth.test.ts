import { describe, it, expect, beforeAll } from "vitest";
import { signSession, verifySession } from "@/lib/auth";
import { verifyToken } from "@/lib/auth-shared";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-must-be-at-least-32-chars-long-yes-it-is";
});

describe("session sign/verify", () => {
  it("round-trips a payload", async () => {
    const token = await signSession({
      sub: "u1",
      email: "a@b.co",
      role: "ADMIN",
    });
    const payload = await verifySession(token);
    expect(payload?.sub).toBe("u1");
    expect(payload?.email).toBe("a@b.co");
    expect(payload?.role).toBe("ADMIN");
  });

  it("verifyToken returns null for tampered token", async () => {
    const token = await signSession({
      sub: "u1",
      email: "a@b.co",
      role: "ADMIN",
    });
    const tampered = token.slice(0, -2) + "AA";
    expect(await verifyToken(tampered)).toBeNull();
  });

  it("verifyToken returns null for undefined", async () => {
    expect(await verifyToken(undefined)).toBeNull();
  });
});
