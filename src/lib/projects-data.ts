import { unstable_cache } from "next/cache";
import type { Project } from "@prisma/client";
import { prisma } from "./prisma";

export const PROJECTS_TAG = "projects";

export const getPublishedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    try {
      return await prisma.project.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      });
    } catch {
      return [];
    }
  },
  ["projects:published"],
  { revalidate: 300, tags: [PROJECTS_TAG] }
);
