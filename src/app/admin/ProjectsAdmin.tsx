"use client";

import { FormEvent, useState, useTransition } from "react";
import type { Project } from "@prisma/client";
import { Loader2, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { slugify } from "@/lib/utils";

type Draft = Partial<Project> & { tech?: string[] };

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
  const router = useRouter();
  const [list, setList] = useState<Project[]>(initialProjects);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);

  function openNew() {
    setDraft({ ...empty });
    setErrors({});
    setOpen(true);
  }

  function openEdit(p: Project) {
    setDraft({
      ...p,
      liveUrl: p.liveUrl ?? "",
      githubUrl: p.githubUrl ?? "",
    });
    setErrors({});
    setOpen(true);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    const isEdit = Boolean(draft.id);
    const url = isEdit ? `/api/projects/${draft.id}` : "/api/projects";
    const method = isEdit ? "PATCH" : "POST";

    const payload = {
      ...draft,
      tech: Array.isArray(draft.tech)
        ? draft.tech
        : String(draft.tech ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
      order: Number(draft.order ?? 0),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json?.fieldErrors) setErrors(json.fieldErrors);
        throw new Error(json?.error ?? "Save failed");
      }
      setOpen(false);
      if (isEdit) {
        setList((l) => l.map((p) => (p.id === json.project.id ? json.project : p)));
      } else {
        setList((l) => [json.project, ...l]);
      }
      startTransition(() => router.refresh());
    } catch (err: any) {
      setErrors((e) => ({ ...e, _: err.message ?? "Save failed" }));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setList((l) => l.filter((p) => p.id !== id));
      startTransition(() => router.refresh());
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

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-ink-300">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Category</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">Tech</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr
                key={p.id}
                className="border-t border-white/5 hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-16 overflow-hidden rounded-md bg-white/5">
                      {p.imageUrl && (
                        <Image
                          src={p.imageUrl}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        {p.title}
                        {p.featured && (
                          <Star className="h-3.5 w-3.5 text-accent-lime" />
                        )}
                      </div>
                      <div className="text-xs text-ink-400">/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-ink-300">
                  {p.category}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {p.tech.slice(0, 3).map((t) => (
                      <span key={t} className="chip text-[10px]">
                        {t}
                      </span>
                    ))}
                    {p.tech.length > 3 && (
                      <span className="chip text-[10px]">+{p.tech.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.published
                        ? "chip border-accent-lime/30 text-accent-lime"
                        : "chip"
                    }
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full glass hover:bg-white/10"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(p.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-pink/10 border border-accent-pink/30 text-accent-pink hover:bg-accent-pink/20"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-ink-400">
                  No projects yet. Click “New project” to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink-950/80 px-4 py-10 backdrop-blur"
          onClick={() => !saving && setOpen(false)}
        >
          <form
            onSubmit={onSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl glass-strong rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">
                {draft.id ? "Edit project" : "New project"}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full glass hover:bg-white/10"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Title" error={errors.title}>
                <input
                  required
                  value={draft.title ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      title: e.target.value,
                      slug: d.id ? d.slug : slugify(e.target.value),
                    }))
                  }
                  className="input"
                />
              </Field>
              <Field label="Slug" error={errors.slug}>
                <input
                  required
                  value={draft.slug ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, slug: slugify(e.target.value) }))
                  }
                  className="input font-mono text-sm"
                />
              </Field>
              <Field label="Tagline" error={errors.tagline} className="sm:col-span-2">
                <input
                  required
                  value={draft.tagline ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, tagline: e.target.value }))
                  }
                  className="input"
                />
              </Field>
              <Field
                label="Description"
                error={errors.description}
                className="sm:col-span-2"
              >
                <textarea
                  required
                  rows={4}
                  value={draft.description ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, description: e.target.value }))
                  }
                  className="input resize-y"
                />
              </Field>
              <Field
                label="Image URL"
                error={errors.imageUrl}
                className="sm:col-span-2"
              >
                <input
                  required
                  type="url"
                  value={draft.imageUrl ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, imageUrl: e.target.value }))
                  }
                  className="input"
                  placeholder="https://…"
                />
              </Field>
              <Field label="Live URL" error={errors.liveUrl}>
                <input
                  type="url"
                  value={draft.liveUrl ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, liveUrl: e.target.value }))
                  }
                  className="input"
                />
              </Field>
              <Field label="GitHub URL" error={errors.githubUrl}>
                <input
                  type="url"
                  value={draft.githubUrl ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, githubUrl: e.target.value }))
                  }
                  className="input"
                />
              </Field>
              <Field
                label="Tech (comma-separated)"
                error={errors.tech}
                className="sm:col-span-2"
              >
                <input
                  value={
                    Array.isArray(draft.tech)
                      ? draft.tech.join(", ")
                      : (draft.tech ?? "")
                  }
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      tech: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="input"
                  placeholder="Next.js, TypeScript, Postgres"
                />
              </Field>
              <Field label="Category" error={errors.category}>
                <input
                  value={draft.category ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, category: e.target.value }))
                  }
                  className="input"
                />
              </Field>
              <Field label="Order" error={errors.order}>
                <input
                  type="number"
                  min={0}
                  value={draft.order ?? 0}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, order: Number(e.target.value) }))
                  }
                  className="input"
                />
              </Field>
              <div className="sm:col-span-2 flex items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 text-sm text-ink-200">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.featured)}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, featured: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-500"
                  />
                  Featured
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-ink-200">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.published)}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, published: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-500"
                  />
                  Published
                </label>
              </div>
            </div>

            {errors._ && (
              <p className="mt-4 rounded-xl bg-accent-pink/10 border border-accent-pink/30 px-4 py-3 text-sm text-accent-pink">
                {errors._}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : draft.id ? (
                  "Save changes"
                ) : (
                  "Create project"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      {isPending && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex items-center gap-2 rounded-full glass-strong px-3 py-1.5 text-xs text-ink-200">
          <Loader2 className="h-3 w-3 animate-spin" /> Refreshing…
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="label-muted">{label}</span>
      <div className="mt-2">{children}</div>
      {error && (
        <span className="mt-1 block text-xs text-accent-pink">{error}</span>
      )}
    </label>
  );
}
