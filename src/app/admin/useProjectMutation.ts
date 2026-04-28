"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@prisma/client";
import { errorMessage } from "@/lib/utils";

export type Draft = Partial<Project> & { tech?: string[] };

type SaveResult =
  | { ok: true; project: Project; isEdit: boolean }
  | { ok: false; fieldErrors: Record<string, string> };

export function useProjectMutation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function save(draft: Draft): Promise<SaveResult> {
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
        return {
          ok: false,
          fieldErrors: {
            ...(json?.fieldErrors ?? {}),
            _: json?.error ?? "Save failed",
          },
        };
      }
      startTransition(() => router.refresh());
      return { ok: true, project: json.project, isEdit };
    } catch (err) {
      return { ok: false, fieldErrors: { _: errorMessage(err, "Save failed") } };
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string): Promise<boolean> {
    setDeleting(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        startTransition(() => router.refresh());
        return true;
      }
      return false;
    } finally {
      setDeleting(null);
    }
  }

  return { save, remove, saving, deleting, isPending };
}
