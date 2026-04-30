import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import { contactSchema, flattenErrors } from "@/lib/validators";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const MAX_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  const ip = getClientIp(req);

  if (!(await rateLimit("contact", ip, MAX_PER_HOUR, WINDOW_MS))) {
    return NextResponse.json(
      { error: "Slow down — you've sent too many messages recently." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", fieldErrors: flattenErrors(parsed.error) },
      { status: 400 }
    );
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success so they don't retry.
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, message } = parsed.data;
  const userAgent = req.headers.get("user-agent") ?? undefined;

  try {
    await prisma.contactMessage.create({
      data: { name, email, message, ip, userAgent },
    });
  } catch (e) {
    console.error("[contact] persist failed", e);
    return NextResponse.json(
      { error: "Could not save message. Please email instead." },
      { status: 500 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Portfolio Contact <onboarding@resend.dev>";

  console.log("[contact] RESEND_API_KEY present:", !!apiKey, "| prefix:", apiKey?.slice(0, 6));

  if (apiKey) {
    const resend = new Resend(apiKey);
    const date = new Date().toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
      dateStyle: "long",
      timeStyle: "short",
    });

    try {
      await resend.emails.send({
        from,
        to: site.email,
        replyTo: email,
        subject: `✉️ Nouveau message de ${name}`,
        html: `
<div style="font-family:sans-serif;max-width:600px;margin:auto;color:#1a1a1a">
  <h2 style="margin-bottom:4px">Nouveau message de contact</h2>
  <p style="color:#666;font-size:13px;margin-top:0">${date}</p>
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0"/>
  <table style="width:100%;border-collapse:collapse;font-size:15px">
    <tr>
      <td style="padding:8px 0;color:#666;width:80px;vertical-align:top">Nom</td>
      <td style="padding:8px 0;font-weight:600">${name}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;color:#666;vertical-align:top">Email</td>
      <td style="padding:8px 0">
        <a href="mailto:${email}" style="color:#6366f1">${email}</a>
      </td>
    </tr>
  </table>
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0"/>
  <p style="font-size:14px;color:#666;margin-bottom:6px">Message</p>
  <p style="background:#f9f9f9;border-left:3px solid #6366f1;padding:12px 16px;border-radius:4px;white-space:pre-wrap;font-size:15px;margin:0">${message}</p>
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0"/>
  <p style="font-size:12px;color:#999">
    Envoyé depuis <a href="${site.url}" style="color:#999">${site.url}</a> — IP : ${ip ?? "inconnue"}
  </p>
</div>`,
      });
    } catch (e) {
      console.error("[contact] email failed", e);
    }
  } else {
    console.warn("[contact] RESEND_API_KEY not set — skipping email.");
  }

  return NextResponse.json({ ok: true });
}
