import { describe, it, expect, beforeEach, vi } from "vitest";

// vi.hoisted ensures mockStore is defined before vi.mock factories run
const { mockStore } = vi.hoisted(() => ({
  mockStore: new Map<string, { count: number; reset: number }>(),
}));

vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: () => ({}) },
}));

vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    private max: number;
    private windowMs: number;
    private prefix: string;

    constructor(opts: {
      redis: unknown;
      limiter: { max: number; windowMs: number };
      prefix: string;
      analytics: boolean;
    }) {
      this.max = opts.limiter.max;
      this.windowMs = opts.limiter.windowMs;
      this.prefix = opts.prefix;
    }

    async limit(ip: string) {
      const key = `${this.prefix}:${ip}`;
      const now = Date.now();
      const entry = mockStore.get(key);
      if (!entry || entry.reset <= now) {
        mockStore.set(key, { count: 1, reset: now + this.windowMs });
        return { success: true };
      }
      entry.count++;
      return { success: entry.count <= this.max };
    }

    static slidingWindow(max: number, window: string) {
      return { max, windowMs: parseInt(window) };
    }
  }

  return { Ratelimit };
});

import { rateLimit, getClientIp } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    mockStore.clear();
  });

  it("allows up to `max` calls per window", async () => {
    const key = "test-allow";
    expect(await rateLimit(key, "1.1.1.1", 3, 60_000)).toBe(true);
    expect(await rateLimit(key, "1.1.1.1", 3, 60_000)).toBe(true);
    expect(await rateLimit(key, "1.1.1.1", 3, 60_000)).toBe(true);
    expect(await rateLimit(key, "1.1.1.1", 3, 60_000)).toBe(false);
  });

  it("isolates IPs", async () => {
    const key = "test-isolate";
    expect(await rateLimit(key, "2.2.2.2", 1, 60_000)).toBe(true);
    expect(await rateLimit(key, "2.2.2.2", 1, 60_000)).toBe(false);
    expect(await rateLimit(key, "3.3.3.3", 1, 60_000)).toBe(true);
  });

  it("isolates keys (login vs contact)", async () => {
    expect(await rateLimit("login", "4.4.4.4", 1, 60_000)).toBe(true);
    expect(await rateLimit("login", "4.4.4.4", 1, 60_000)).toBe(false);
    expect(await rateLimit("contact", "4.4.4.4", 1, 60_000)).toBe(true);
  });

  it("resets after the window expires", async () => {
    const key = "test-reset";
    expect(await rateLimit(key, "5.5.5.5", 1, 60_000)).toBe(true);
    expect(await rateLimit(key, "5.5.5.5", 1, 60_000)).toBe(false);
    vi.advanceTimersByTime(60_001);
    expect(await rateLimit(key, "5.5.5.5", 1, 60_000)).toBe(true);
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
