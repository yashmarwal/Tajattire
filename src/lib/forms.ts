import { EMAIL } from "./contact";
import { insertEnquiry } from "./publicApi";

/** Web3Forms public access key. This key is designed to live in client code
 * (it only lets someone send mail to the configured inbox); spam is handled
 * by the honeypot below plus Web3Forms' own filtering. */
const WEB3FORMS_KEY = "eac902e8-cb07-44ff-b8d0-6fb0785f6ba0";
const ENDPOINT = "https://api.web3forms.com/submit";

/** Hard caps so nobody can paste a novel into a field. */
export const LIMITS = { short: 80, medium: 160, long: 1500 } as const;

export const cap = (v: string, max: number = LIMITS.medium) => v.slice(0, max);

/** Name of the hidden honeypot input. Real visitors never see or fill it. */
export const HONEYPOT_NAME = "botcheck";

const MIN_GAP_MS = 4000;
let lastSentAt = 0;

export type SendResult = { ok: true } | { ok: false; reason: "network" | "rejected" | "too-fast" };

export interface SendInput {
  subject: string;
  fromName: string;
  message: string;
  /** Value of the honeypot input. Anything non-empty means a bot filled it. */
  honeypot: string;
  replyName?: string;
  attachment?: File | null;
}

/** Sends a form through Web3Forms. Silently drops honeypot hits (reporting
 * success so bots learn nothing) and refuses a second send within a few
 * seconds of the last one to stop double-submits. */
export async function sendForm(input: SendInput): Promise<SendResult> {
  if (input.honeypot.trim()) return { ok: true };
  const now = Date.now();
  if (now - lastSentAt < MIN_GAP_MS) return { ok: false, reason: "too-fast" };
  lastSentAt = now;

  const fd = new FormData();
  fd.append("access_key", WEB3FORMS_KEY);
  fd.append("subject", cap(input.subject, LIMITS.medium));
  fd.append("from_name", cap(input.fromName, LIMITS.short));
  fd.append("name", cap(input.replyName ?? input.fromName, LIMITS.short));
  fd.append("email", EMAIL);
  fd.append("message", cap(input.message, 4000));
  fd.append(HONEYPOT_NAME, "");
  if (input.attachment) fd.append("attachment", input.attachment, input.attachment.name);

  try {
    const res = await fetch(ENDPOINT, { method: "POST", body: fd });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    if (res.ok && json.success !== false) return { ok: true };
    lastSentAt = 0; // allow an instant retry
    return { ok: false, reason: "rejected" };
  } catch {
    lastSentAt = 0;
    return { ok: false, reason: "network" };
  }
}

/** Best-effort copy of a lead into the admin's Submissions table. Never
 * throws and never blocks the visitor. */
export function logLead(row: {
  name?: string;
  phone?: string;
  city?: string;
  message: string;
  product?: string | null;
}) {
  void insertEnquiry({
    name: cap(row.name ?? "", LIMITS.short),
    email: "",
    phone: cap(row.phone ?? "", 30),
    city: cap(row.city ?? "", LIMITS.short),
    message: cap(row.message, LIMITS.long),
    product: row.product ? cap(row.product, LIMITS.medium) : null,
  }).catch(() => {});
}
