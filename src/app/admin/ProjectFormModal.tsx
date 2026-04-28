"use client";

import { FormEvent, useState } from "react";
import { Loader2, X } from "lucide-react";
import { slugify } from "@/lib/utils";
import { Field } from "@/components/forms/Field";
import type { Draft } from "./useProjectMutation";

type Props = {
  draft: Draft;
  errors: Record<string, string>;
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>, draft: Draft) => void;
  onChange: (next: Draft) => void;
};

export function ProjectFormModal({
  draft,
  errors,
  saving,
  onClose,
  onSubmit,
  onChange,
}: Props) {
  const [local, setLocal] = useState<Draft>(draft);

  function update(patch: Partial<Draft>) {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink-950/80 px-4 py-10 backdrop-blur"
      onClick={() => !saving && onClose()}
    >
      <form
        onSubmit={(e) => onSubmit(e, local)}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl glass-strong rounded-3xl p-6 sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">
            {local.id ? "Edit project" : "New project"}
          </h2>
          <button
            type="button"
            onClick={onClose}
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
              value={local.title ?? ""}
              onChange={(e) =>
                update({
                  title: e.target.value,
                  slug: local.id ? local.slug : slugify(e.target.value),
                })
              }
              className="input"
            />
          </Field>
          <Field label="Slug" error={errors.slug}>
            <input
              required
              value={local.slug ?? ""}
              onChange={(e) => update({ slug: slugify(e.target.value) })}
              className="input font-mono text-sm"
            />
          </Field>
          <Field label="Tagline" error={errors.tagline} className="sm:col-span-2">
            <input
              required
              value={local.tagline ?? ""}
              onChange={(e) => update({ tagline: e.target.value })}
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
              value={local.description ?? ""}
              onChange={(e) => update({ description: e.target.value })}
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
              value={local.imageUrl ?? ""}
              onChange={(e) => update({ imageUrl: e.target.value })}
              className="input"
              placeholder="https://…"
            />
          </Field>
          <Field label="Live URL" error={errors.liveUrl}>
            <input
              type="url"
              value={local.liveUrl ?? ""}
              onChange={(e) => update({ liveUrl: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="GitHub URL" error={errors.githubUrl}>
            <input
              type="url"
              value={local.githubUrl ?? ""}
              onChange={(e) => update({ githubUrl: e.target.value })}
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
                Array.isArray(local.tech)
                  ? local.tech.join(", ")
                  : (local.tech ?? "")
              }
              onChange={(e) =>
                update({
                  tech: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="input"
              placeholder="Next.js, TypeScript, Postgres"
            />
          </Field>
          <Field label="Category" error={errors.category}>
            <input
              value={local.category ?? ""}
              onChange={(e) => update({ category: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Order" error={errors.order}>
            <input
              type="number"
              min={0}
              value={local.order ?? 0}
              onChange={(e) => update({ order: Number(e.target.value) })}
              className="input"
            />
          </Field>
          <div className="sm:col-span-2 flex items-center gap-6 pt-1">
            <label className="inline-flex items-center gap-2 text-sm text-ink-200">
              <input
                type="checkbox"
                checked={Boolean(local.featured)}
                onChange={(e) => update({ featured: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-500"
              />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-ink-200">
              <input
                type="checkbox"
                checked={Boolean(local.published)}
                onChange={(e) => update({ published: e.target.checked })}
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
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : local.id ? (
              "Save changes"
            ) : (
              "Create project"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
