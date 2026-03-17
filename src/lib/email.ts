import nodemailer from "nodemailer";

function readPort(value: string) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 587;
}

export function canSendEmail() {
  const host = (process.env.SMTP_HOST ?? "").trim();
  const port = (process.env.SMTP_PORT ?? "").trim();
  const from = (process.env.SMTP_FROM ?? "").trim();
  const to = (process.env.INQUIRY_TO ?? "").trim();
  return Boolean(host && port && from && to);
}

export async function sendInquiryEmail(params: {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
}) {
  const host = (process.env.SMTP_HOST ?? "").trim();
  const port = readPort((process.env.SMTP_PORT ?? "").trim());
  const user = (process.env.SMTP_USER ?? "").trim();
  const pass = (process.env.SMTP_PASS ?? "").trim();
  const secure = String(process.env.SMTP_SECURE ?? "").trim() === "true" || port === 465;

  if (!host) throw new Error("Missing SMTP_HOST.");
  if (!port) throw new Error("Missing SMTP_PORT.");
  if (!params.from) throw new Error("Missing SMTP_FROM.");
  if (!params.to) throw new Error("Missing INQUIRY_TO.");
  if (!user || !pass) throw new Error("Missing SMTP credentials.");

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transport.sendMail({
    to: params.to,
    from: params.from,
    replyTo: params.replyTo,
    subject: params.subject,
    text: params.text,
  });
}

