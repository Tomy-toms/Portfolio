"use client";

import { FormEvent, useState } from "react";
import type { Project } from "@prisma/client";
import { Loader2, Plus } from "lucide-react";
import { ProjectsTable } from "./ProjectsTable";
import { ProjectFormModal } from "./ProjectFormModal";
import { useProjectMutation, type Draft } from "./useProjectMutation";

const empty: Draft = {
  slug: "",
  title: "",
  tagline: "",
  description: "",
  imageUrl: "",
  liveUrl: "",
  githubUrl: "",
  tech: [],
  category: "Web",
  featured: false,
  order: 0,
  published: true,
};

export function ProjectsAdmin({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [list, setList] = useState<Project[]>(initialProjects);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { save, remove, saving, isPending } = useProjectMutation();

  function openNew() {
    setDraft({ ...empty });
    setErrors({});
    setOpen(true);
  }

  function openEdit(p: Project) {
    setDraft({ ...p, liveUrl: p.liveUrl ?? "", githubUrl: p.githubUrl ?? "" });
    setErrors({});
    setOpen(true);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>, current: Draft) {
    e.preventDefault();
    setErrors({});
    const result = await save(current);
    if (!result.ok) {
      setErrors(result.fieldErrors);
      return;
    }
    setOpen(false);
    if (result.isEdit) {
      setList((l) =>
        l.map((p) => (p.id === result.project.id ? result.project : p))
      );
    } else {
      setList((l) => [result.project, ...l]);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const ok = await remove(id);
    if (ok) {
      setList((l) => l.filter((p) => p.id !== id));
    } else {
      alert("Delete failed");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <button type="button" onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" />
          New project
        </button>
      </div>

      <ProjectsTable projects={list} onEdit={openEdit} onDelete={onDelete} />

      {open && (
        <ProjectFormModal
          draft={draft}
          errors={errors}
          saving={saving}
          onClose={() => !saving && setOpen(false)}
          onSubmit={onSubmit}
          onChange={setDraft}
        />
      )}

      {isPending && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex items-center gap-2 rounded-full glass-strong px-3 py-1.5 text-xs text-ink-200">
          <Loader2 className="h-3 w-3 animate-spin" /> Refreshing…
        </div>
      )}
    </div>
  );
}
