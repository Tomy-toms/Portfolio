import { prisma } from "@/lib/prisma";
import { ProjectsAdmin } from "./ProjectsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  const unread = await prisma.contactMessage.count({ where: { read: false } });
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-ink-300">
            {projects.length} total · {unread} unread messages
          </p>
        </div>
      </div>
      <ProjectsAdmin initialProjects={projects} />
    </div>
  );
}
