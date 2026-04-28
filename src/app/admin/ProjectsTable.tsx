"use client";

import Image from "next/image";
import { Pencil, Star, Trash2 } from "lucide-react";
import type { Project } from "@prisma/client";

type Props = {
  projects: Project[];
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
};

export function ProjectsTable({ projects, onEdit, onDelete }: Props) {
  if (projects.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="px-4 py-12 text-center text-ink-400">
          No projects yet. Click “New project” to add one.
        </div>
      </div>
    );
  }

  return (
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
          {projects.map((p) => (
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
                    onClick={() => onEdit(p)}
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
        </tbody>
      </table>
    </div>
  );
}
