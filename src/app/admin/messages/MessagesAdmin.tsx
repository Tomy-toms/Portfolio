"use client";

import { useState } from "react";
import type { ContactMessage } from "@prisma/client";
import { Check, Mail, Trash2 } from "lucide-react";

export function MessagesAdmin({
  initialMessages,
}: {
  initialMessages: ContactMessage[];
}) {
  const [list, setList] = useState(initialMessages);

  async function toggleRead(m: ContactMessage) {
    const res = await fetch(`/api/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read }),
    });
    if (res.ok) {
      const { message } = await res.json();
      setList((l) => l.map((x) => (x.id === message.id ? message : x)));
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (res.ok) setList((l) => l.filter((m) => m.id !== id));
  }

  if (list.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center text-ink-300">
        No messages yet.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {list.map((m) => (
        <li
          key={m.id}
          className={`glass rounded-2xl p-5 transition ${
            m.read ? "opacity-70" : ""
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-white">{m.name}</span>
                {!m.read && (
                  <span className="chip border-accent-cyan/40 text-accent-cyan">
                    New
                  </span>
                )}
              </div>
              <a
                href={`mailto:${m.email}`}
                className="flex items-center gap-1.5 text-sm text-ink-300 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                {m.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-400">
                {new Date(m.createdAt).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => toggleRead(m)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full glass hover:bg-white/10"
                aria-label={m.read ? "Mark unread" : "Mark read"}
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(m.id)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-pink/10 border border-accent-pink/30 text-accent-pink hover:bg-accent-pink/20"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-ink-200">
            {m.message}
          </p>
        </li>
      ))}
    </ul>
  );
}
