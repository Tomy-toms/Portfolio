import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Invalid email").max(200),
  message: z.string().trim().min(10, "Tell me a bit more").max(5000),
  website: z.string().optional(), // honeypot
});

export const projectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case: my-project"),
  title: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(5000),
  imageUrl: z.string().url().max(500),
  liveUrl: z.string().url().max(500).optional().or(z.literal("")),
  githubUrl: z.string().url().max(500).optional().or(z.literal("")),
  tech: z.array(z.string().trim().min(1).max(40)).max(20),
  category: z.string().trim().min(1).max(40).default("Web"),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;

export function flattenErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const path = issue.path.join(".") || "_";
    if (!out[path]) out[path] = issue.message;
  }
  return out;
}
