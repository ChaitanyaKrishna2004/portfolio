import "server-only";
import { z } from "zod";
import { ContactMessage } from "@/models";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("That email address doesn't look right.").max(160),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell me a little more — at least 10 characters.").max(5000),
  // Honeypot: real people never fill this, bots usually do. It must NOT have a
  // validation rule — rejecting it would tell the bot the field is a trap.
  // The drop happens silently in createMessage below.
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export async function createMessage(
  input: unknown,
  meta: { ip?: string | null; userAgent?: string | null } = {}
) {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false as const,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { website, ...data } = parsed.data;

  // Accept-and-drop: a bot gets a success response and learns nothing.
  if (website) return { ok: true as const, id: null };

  const row = await ContactMessage.create({
    name: data.name,
    email: data.email,
    subject: data.subject || null,
    message: data.message,
    ipAddress: meta.ip ?? null,
    userAgent: meta.userAgent ?? null,
    status: "new",
  });

  return { ok: true as const, id: row.id };
}

export async function listMessages(status?: string) {
  const rows = await ContactMessage.findAll({
    where: status ? { status } : undefined,
    order: [["createdAt", "DESC"]],
    limit: 200,
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    subject: r.subject,
    message: r.message,
    status: r.status,
    createdAt: r.createdAt,
  }));
}
