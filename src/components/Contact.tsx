"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { errorMessage } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { Field } from "./forms/Field";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

export function Contact() {
  const t = useTranslations("Contact");
  const [state, setState] = useState<State>({ status: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const successRef = useRef<HTMLParagraphElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error") errorRef.current?.focus();
  }, [state.status]);

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
    } catch (err) {
      setState({ status: "error", message: errorMessage(err, t("errorFallback")) });
    }
  }

  return (
    <section id="contact" className="relative py-16 sm:py-24 lg:py-32">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeader
              eyebrow={t("eyebrow")}
              titleA={t("titleA")}
              titleAccent={t("titleAccent")}
              titleB={t("titleB")}
              intro={t("description")}
            />
            <div className="mt-10 glass rounded-2xl p-6">
              <div className="label-muted">{t("alsoOn")}</div>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <li>
                  <a
                    href={`tel:${site.phone}`}
                    aria-label={t("phoneAria", { phone: site.phoneDisplay })}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-ink-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <span>{site.phoneDisplay}</span>
                    <span aria-hidden className="text-ink-300">↗</span>
                  </a>
                </li>
                {Object.entries(site.social).map(([k, v]) => (
                  <li key={k}>
                    <a
                      href={v}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t("socialAria", { network: k })}
                      className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-ink-200 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <span className="capitalize">{k}</span>
                      <span aria-hidden className="text-ink-300">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="glass-strong rounded-3xl p-6 sm:p-8"
              noValidate
              aria-label={t("formAria")}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={t("name")}
                  htmlFor="contact-name"
                  required
                  requiredAriaSuffix={t("required")}
                  error={fieldErrors.name}
                >
                  <input
                    id="contact-name"
                    name="name"
                    required
                    maxLength={80}
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                    className="input"
                    placeholder={t("namePlaceholder")}
                  />
                </Field>
                <Field
                  label={t("email")}
                  htmlFor="contact-email"
                  required
                  requiredAriaSuffix={t("required")}
                  error={fieldErrors.email}
                >
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={200}
                    autoComplete="email"
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                    className="input"
                    placeholder={t("emailPlaceholder")}
                  />
                </Field>
              </div>
              <Field
                className="mt-4"
                label={t("message")}
                htmlFor="contact-message"
                required
                requiredAriaSuffix={t("required")}
                error={fieldErrors.message}
              >
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  aria-required="true"
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                  className="input resize-y"
                  placeholder={t("messagePlaceholder")}
                />
              </Field>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -z-10 opacity-0 pointer-events-none"
              />
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="text-xs text-ink-300">{t("protected")}</p>
                <button
                  type="submit"
                  disabled={state.status === "loading"}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {state.status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      {t("sending")}
                    </>
                  ) : state.status === "success" ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden />
                      {t("sent")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden />
                      {t("send")}
                    </>
                  )}
                </button>
              </div>
              {state.status === "error" && (
                <p
                  ref={errorRef}
                  tabIndex={-1}
                  role="alert"
                  className="mt-4 rounded-xl bg-accent-pink/10 border border-accent-pink/30 px-4 py-3 text-sm text-accent-pink outline-none"
                >
                  {state.message}
                </p>
              )}
              {state.status === "success" && (
                <p
                  ref={successRef}
                  tabIndex={-1}
                  role="status"
                  className="mt-4 rounded-xl bg-accent-lime/10 border border-accent-lime/30 px-4 py-3 text-sm text-accent-lime outline-none"
                >
                  {t("success")}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
