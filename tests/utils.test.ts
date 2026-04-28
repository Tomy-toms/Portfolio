import { describe, it, expect } from "vitest";
import { cn, slugify, errorMessage } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("dedupes conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("filters falsy values", () => {
    expect(cn("a", null, undefined, false, "b")).toBe("a b");
  });
});

describe("slugify", () => {
  it("lowercases and joins with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("strips non-alnum chars", () => {
    expect(slugify("Café & Co!")).toBe("caf-co");
  });
  it("collapses repeated dashes", () => {
    expect(slugify("a---b")).toBe("a-b");
  });
  it("returns empty string for non-alnum input", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("errorMessage", () => {
  it("returns Error.message", () => {
    expect(errorMessage(new Error("boom"))).toBe("boom");
  });
  it("returns string as-is", () => {
    expect(errorMessage("plain")).toBe("plain");
  });
  it("falls back for unknown shapes", () => {
    expect(errorMessage({ weird: true }, "fallback")).toBe("fallback");
  });
  it("falls back when Error.message is empty", () => {
    expect(errorMessage(new Error(""), "fb")).toBe("fb");
  });
});
