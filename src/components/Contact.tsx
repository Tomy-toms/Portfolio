"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { SectionReveal } from "./SectionReveal";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

export function Contact() {
  const t = useTranslations("Contact");
  const [state, setState] = useState<State>({ status: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    const form = new FormData(e.currentTarget);
    const data = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      website: String(form.get("website") ?? ""),
    };
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json?.fieldErrors) setFieldErrors(json.fieldErrors);
        throw new Error(json?.error ?? t("errorFallback"));
      }
      setState({ status: "success" });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setState({ status: "error", message: err.message ?? t("errorFallback") });
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <SectionReveal className="lg:col-span-5">
            <span className="label-muted">{t("eyebrow")}</span>
            <h2 className="section-heading mt-3">
              {t("titleA")}
              <span className="text-gradient-accent">{t("titleAccent")}</span>
              {t("titleB")}
            </h2>
            <p className="mt-6 text-ink-300">{t("description")}</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-flex items-center gap-2 font-display text-lg text-white hover:text-accent-cyan transition"
            >
              <Mail className="h-5 w-5" />
              {site.email}
            </a>
            <div className="mt-10 glass rounded-2xl p-6">
              <div className="label-muted">{t("alsoOn")}</div>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(site.social).map(([k, v]) => (
                  <li key={k}>
                    <a
                      href={v}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-ink-200 hover:bg-white/10 hover:text-white transition"
                    >
                      <span className="capitalize">{k}</span>
                      <span className="text-ink-400">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="glass-strong rounded-3xl p-6 sm:p-8"
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label-muted">{t("name")}</span>
                  <input
                    name="name"
                    required
                    maxLength={80}
                    autoComplete="name"
                    className="input mt-2"
                    placeholder={t("namePlaceholder")}
                  />
                  {fieldErrors.name && (
                    <span className="mt-1 block text-xs text-accent-pink">
                      {fieldErrors.name}
                    </span>
                  )}
                </label>
                <label className="block">
                  <span className="label-muted">{t("email")}</span>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    className="input mt-2"
                    placeholder={t("emailPlaceholder")}
                  />
                  {fieldErrors.email && (
                    <span className="mt-1 block text-xs text-accent-pink">
                      {fieldErrors.email}
                    </span>
                  )}
                </label>
              </div>
              <label className="mt-4 block">
                <span className="label-muted">{t("message")}</span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  className="input mt-2 resize-y"
                  placeholder={t("messagePlaceholder")}
                />
                {fieldErrors.message && (
                  <span className="mt-1 block text-xs text-accent-pink">
                    {fieldErrors.message}
                  </span>
                )}
              </label>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -z-10 opacity-0 pointer-events-none"
              />
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-xs text-ink-400">{t("protected")}</p>
                <button
                  type="submit"
                  disabled={state.status === "loading"}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {state.status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("sending")}
                    </>
                  ) : state.status === "success" ? (
                    <>
                      <Check className="h-4 w-4" />
                      {t("sent")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t("send")}
                    </>
                  )}
                </button>
              </div>
              {state.status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl bg-accent-pink/10 border border-accent-pink/30 px-4 py-3 text-sm text-accent-pink"
                >
                  {state.message}
                </motion.p>
              )}
              {state.status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl bg-accent-lime/10 border border-accent-lime/30 px-4 py-3 text-sm text-accent-lime"
                >
                  {t("success")}
                </motion.p>
              )}
            </form>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
