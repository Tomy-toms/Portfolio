import { describe, it, expect } from "vitest";
import {
  ServiceItemsSchema,
  MethodStepsSchema,
  FaqItemsSchema,
  ExperienceItemsSchema,
} from "@/lib/i18n-schemas";

describe("i18n schemas", () => {
  it("ServiceItemsSchema accepts a valid array", () => {
    const r = ServiceItemsSchema.safeParse([
      { badge: "", title: "t", description: "d", features: ["a"], for: "x" },
    ]);
    expect(r.success).toBe(true);
  });

  it("ServiceItemsSchema rejects missing fields", () => {
    const r = ServiceItemsSchema.safeParse([{ title: "t" }]);
    expect(r.success).toBe(false);
  });

  it("MethodStepsSchema requires number/title/duration/description", () => {
    expect(
      MethodStepsSchema.safeParse([
        { number: "01", title: "t", duration: "1d", description: "x" },
      ]).success
    ).toBe(true);
  });

  it("FaqItemsSchema requires q and a", () => {
    expect(FaqItemsSchema.safeParse([{ q: "?", a: "!" }]).success).toBe(true);
    expect(FaqItemsSchema.safeParse([{ q: "?" }]).success).toBe(false);
  });

  it("ExperienceItemsSchema requires points array", () => {
    expect(
      ExperienceItemsSchema.safeParse([
        {
          role: "Dev",
          company: "Co",
          period: "2020",
          location: "Alès",
          points: ["p1"],
        },
      ]).success
    ).toBe(true);
  });
});
