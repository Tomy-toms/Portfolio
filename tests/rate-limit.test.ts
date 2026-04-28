import { describe, it, expect, beforeEach, vi } from "vitest";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  it("allows up to `max` calls per window", () => {
    const key = "test-allow";
    expect(rateLimit(key, "1.1.1.1", 3, 60_000)).toBe(true);
    expect(rateLimit(key, "1.1.1.1", 3, 60_000)).toBe(true);
    expect(rateLimit(key, "1.1.1.1", 3, 60_000)).toBe(true);
    expect(rateLimit(key, "1.1.1.1", 3, 60_000)).toBe(false);
  });

  it("isolates IPs", () => {
    const key = "test-isolate";
    expect(rateLimit(key, "2.2.2.2", 1, 60_000)).toBe(true);
    expect(rateLimit(key, "2.2.2.2", 1, 60_000)).toBe(false);
    expect(rateLimit(key, "3.3.3.3", 1, 60_000)).toBe(true);
  });

  it("isolates keys (login vs contact)", () => {
    expect(rateLimit("login", "4.4.4.4", 1, 60_000)).toBe(true);
    expect(rateLimit("login", "4.4.4.4", 1, 60_000)).toBe(false);
    expect(rateLimit("contact", "4.4.4.4", 1, 60_000)).toBe(true);
  });

  it("resets after the window expires", () => {
    const key = "test-reset";
    expect(rateLimit(key, "5.5.5.5", 1, 60_000)).toBe(true);
    expect(rateLimit(key, "5.5.5.5", 1, 60_000)).toBe(false);
    vi.advanceTimersByTime(60_001);
    expect(rateLimit(key, "5.5.5.5", 1, 60_000)).toBe(true);
  });
});

describe("getClientIp", () => {
  it("prefers x-real-ip", () => {
    const req = new Request("http://test", {
      headers: { "x-real-ip": "1.2.3.4", "x-forwarded-for": "5.6.7.8" },
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to first x-forwarded-for entry", () => {
    const req = new Request("http://test", {
      headers: { "x-forwarded-for": "9.9.9.9, 8.8.8.8" },
    });
    expect(getClientIp(req)).toBe("9.9.9.9");
  });

  it("returns unknown when no header", () => {
    const req = new Request("http://test");
    expect(getClientIp(req)).toBe("unknown");
  });
});
