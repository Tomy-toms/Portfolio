import { describe, it, expect } from "vitest";
import {
  contactSchema,
  loginSchema,
  projectSchema,
  flattenErrors,
} from "@/lib/validators";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const r = loginSchema.safeParse({
      email: "a@b.co",
      password: "password123",
    });
    expect(r.success).toBe(true);
  });
  it("rejects short password", () => {
    const r = loginSchema.safeParse({ email: "a@b.co", password: "short" });
    expect(r.success).toBe(false);
  });
  it("rejects bad email", () => {
    const r = loginSchema.safeParse({ email: "nope", password: "longenough" });
    expect(r.success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("accepts a valid message", () => {
    const r = contactSchema.safeParse({
      name: "Jean",
      email: "j@example.com",
      message: "Bonjour, je voudrais un site.",
      website: "",
    });
    expect(r.success).toBe(true);
  });
  it("trims fields", () => {
    const r = contactSchema.safeParse({
      name: "  Jean  ",
      email: "  j@example.com  ",
      message: "  Bonjour, je voudrais un site.  ",
    });
    expect(r.success && r.data.name).toBe("Jean");
  });
  it("rejects too-short message", () => {
    const r = contactSchema.safeParse({
      name: "Jean",
      email: "j@example.com",
      message: "hi",
    });
    expect(r.success).toBe(false);
  });
});

describe("projectSchema", () => {
  const base = {
    slug: "my-project",
    title: "My Project",
    tagline: "A tagline.",
    description: "A description that is long enough.",
    imageUrl: "https://example.com/img.jpg",
    tech: ["Next.js", "TypeScript"],
  };

  it("accepts a valid project", () => {
    const r = projectSchema.safeParse(base);
    expect(r.success).toBe(true);
  });

  it("normalises empty liveUrl to null via transform", () => {
    const r = projectSchema.safeParse({ ...base, liveUrl: "" });
    expect(r.success && r.data.liveUrl).toBe(null);
  });

  it("normalises missing liveUrl to null", () => {
    const r = projectSchema.safeParse(base);
    expect(r.success && r.data.liveUrl).toBe(null);
  });

  it("preserves a real liveUrl", () => {
    const r = projectSchema.safeParse({
      ...base,
      liveUrl: "https://live.example.com",
    });
    expect(r.success && r.data.liveUrl).toBe("https://live.example.com");
  });

  it("rejects non-kebab slugs", () => {
    const r = projectSchema.safeParse({ ...base, slug: "Not_Kebab" });
    expect(r.success).toBe(false);
  });

  it("applies defaults", () => {
    const r = projectSchema.safeParse(base);
    expect(r.success && r.data.published).toBe(true);
    expect(r.success && r.data.featured).toBe(false);
    expect(r.success && r.data.category).toBe("Web");
    expect(r.success && r.data.order).toBe(0);
  });
});

describe("flattenErrors", () => {
  it("flattens nested paths", () => {
    const r = projectSchema.safeParse({});
    expect(r.success).toBe(false);
    if (!r.success) {
      const flat = flattenErrors(r.error);
      expect(Object.keys(flat).length).toBeGreaterThan(0);
    }
  });
});
