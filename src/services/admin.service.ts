import "server-only";
import { revalidatePath } from "next/cache";
import type { Model, ModelStatic } from "sequelize";
import {
  SiteSetting, PageSection, SkillCategory, Project, Experience,
  BlogPost, Media, ContactMessage, AdminUser, AuditLog,
} from "@/models";
import {
  getResource, writableKeys, isStructured, type FieldDef, type ResourceDef,
} from "@/lib/adminSchema";

const MODELS: Record<string, ModelStatic<Model>> = {
  SiteSetting, PageSection, SkillCategory, Project,
  Experience, BlogPost, Media, ContactMessage,
};

export function modelFor(resource: ResourceDef): ModelStatic<Model> {
  const model = MODELS[resource.model];
  if (!model) throw new Error(`No model registered for "${resource.model}".`);
  return model;
}

/**
 * The public pages are prerendered, so a CMS save is invisible until the cache
 * is dropped. Content lives across the whole tree, so we clear the lot.
 */
export function revalidateSite(): void {
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------ coercion */

/**
 * Form values arrive as strings. Cast them to what the column expects, and
 * surface bad JSON as a field error rather than a 500.
 */
export function coerceValue(field: FieldDef, raw: unknown): unknown {
  // Structured editors already send real arrays and objects.
  if (isStructured(field.type)) return raw ?? (field.type === "list" || field.type === "objectList" ? [] : {});

  if (field.type === "json") {
    if (raw === "" || raw === null || raw === undefined) return null;
    if (typeof raw !== "string") return raw;
    try {
      return JSON.parse(raw);
    } catch (err) {
      throw new FieldError(field.key, `Not valid JSON — ${(err as Error).message}`);
    }
  }

  if (field.type === "number") {
    if (raw === "" || raw === null || raw === undefined) return null;
    const n = Number(raw);
    if (Number.isNaN(n)) throw new FieldError(field.key, "Must be a number.");
    return n;
  }

  if (field.type === "boolean") {
    return raw === true || raw === "true" || raw === "on" || raw === 1;
  }

  if (field.type === "date") {
    if (!raw) return null;
    const d = new Date(raw as string);
    if (Number.isNaN(d.getTime())) throw new FieldError(field.key, "Not a valid date.");
    return d;
  }

  if (typeof raw === "string" && raw.trim() === "") return null;
  return raw;
}

export class FieldError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = "FieldError";
  }
}

/**
 * Filters an incoming payload down to writable fields, coercing as it goes.
 *
 * `fields` is passed explicitly because page sections resolve a different set
 * per row — a section whose key has no structured editor falls back to raw
 * JSON, and that value has to be parsed rather than stored as a string.
 */
export function buildPayload(
  resource: ResourceDef,
  body: Record<string, unknown>,
  fields: FieldDef[] = resource.fields
): { values: Record<string, unknown>; errors: Record<string, string> } {
  const allowed = new Set(writableKeys(resource));
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const field of fields) {
    if (!allowed.has(field.key)) continue;
    if (!(field.key in body)) continue;

    try {
      const value = coerceValue(field, body[field.key]);
      if (field.required && (value === null || value === "")) {
        errors[field.key] = `${field.label} is required.`;
        continue;
      }
      values[field.key] = value;
    } catch (err) {
      if (err instanceof FieldError) errors[err.field] = err.message;
      else throw err;
    }
  }

  return { values, errors };
}

/* --------------------------------------------------------------- audit */

export async function recordAudit(input: {
  userId: string | null;
  action: "create" | "update" | "delete" | "login" | "logout";
  entity: string;
  entityId?: string | null;
  diff?: Record<string, unknown> | null;
}): Promise<void> {
  try {
    await AuditLog.create({
      userId: input.userId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      diff: input.diff ?? null,
    });
  } catch (err) {
    // An audit failure must never block the edit the user just made.
    console.error("[audit]", err);
  }
}

/**
 * A detached deep copy of a row.
 *
 * Sequelize's `get({ plain: true })` returns the live `dataValues` object when
 * a model defines no custom getters, so anything captured that way changes
 * underneath you the moment the row is updated.
 */
export function snapshot(row: Model): Record<string, unknown> {
  return JSON.parse(JSON.stringify(row.get({ plain: true })));
}

/** Only the keys that actually changed, so the log stays readable. */
export function diffOf(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): Record<string, unknown> {
  const changes: Record<string, unknown> = {};
  for (const [key, next] of Object.entries(after)) {
    const prev = before[key];
    if (JSON.stringify(prev) !== JSON.stringify(next)) {
      changes[key] = { from: prev, to: next };
    }
  }
  return changes;
}

/* ------------------------------------------------------------ dashboard */

export async function getDashboardStats() {
  const [projects, posts, sections, skills, experiences, media, unread, totalMessages, admins] =
    await Promise.all([
      Project.count(),
      BlogPost.count(),
      PageSection.count(),
      SkillCategory.count(),
      Experience.count(),
      Media.count(),
      ContactMessage.count({ where: { status: "new" } }),
      ContactMessage.count(),
      AdminUser.count(),
    ]);

  return { projects, posts, sections, skills, experiences, media, unread, totalMessages, admins };
}

export async function getRecentMessages(limit = 5) {
  const rows = await ContactMessage.findAll({
    order: [["createdAt", "DESC"]],
    limit,
  });

  return rows.map((r) => ({
    id: r.get("id") as string,
    name: r.get("name") as string,
    email: r.get("email") as string,
    message: r.get("message") as string,
    status: r.get("status") as string,
    createdAt: (r.get("createdAt") as Date).toISOString(),
  }));
}

export async function getRecentActivity(limit = 8) {
  const rows = await AuditLog.findAll({ order: [["createdAt", "DESC"]], limit });

  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    entity: r.entity,
    entityId: r.entityId,
    createdAt: r.createdAt.toISOString(),
  }));
}

export { getResource };
