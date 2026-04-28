import { z } from "zod";

// Runtime validation of i18n `t.raw(...)` payloads. If a translation key is
// renamed or mis-typed, Zod throws a descriptive error at render time instead
// of letting the section render an empty/undefined list silently.

export const ServiceItemSchema = z.object({
  badge: z.string(),
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  for: z.string(),
});
export const ServiceItemsSchema = z.array(ServiceItemSchema);
export type ServiceItem = z.infer<typeof ServiceItemSchema>;

export const MethodStepSchema = z.object({
  number: z.string(),
  title: z.string(),
  duration: z.string(),
  description: z.string(),
});
export const MethodStepsSchema = z.array(MethodStepSchema);
export type MethodStep = z.infer<typeof MethodStepSchema>;

export const FaqItemSchema = z.object({
  q: z.string(),
  a: z.string(),
});
export const FaqItemsSchema = z.array(FaqItemSchema);
export type FaqItem = z.infer<typeof FaqItemSchema>;

export const ExperienceItemSchema = z.object({
  role: z.string(),
  company: z.string(),
  period: z.string(),
  location: z.string(),
  points: z.array(z.string()),
});
export const ExperienceItemsSchema = z.array(ExperienceItemSchema);
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

export const StringListSchema = z.array(z.string());
