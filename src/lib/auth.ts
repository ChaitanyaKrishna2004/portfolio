import "server-only";
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";
import { Op } from "sequelize";
import { AdminUser, AdminSession } from "@/models";

export { hashPassword, verifyPassword } from "./password";

export const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_DAYS = 7;

/* ----------------------------------------------------------------- sessions */

/** Only the hash is stored, so a dumped table cannot be replayed as sessions. */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: string,
  meta: { ip?: string | null; userAgent?: string | null } = {}
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await AdminSession.create({
    userId,
    tokenHash: hashToken(token),
    ipAddress: meta.ip ?? null,
    userAgent: meta.userAgent ?? null,
    expiresAt,
  });

  // Opportunistic cleanup — keeps the table from growing without a cron job.
  await AdminSession.destroy({ where: { expiresAt: { [Op.lt]: new Date() } } });

  return { token, expiresAt };
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await AdminSession.findOne({
    where: { tokenHash: hashToken(token), expiresAt: { [Op.gt]: new Date() } },
  });
  if (!session) return null;

  const user = await AdminUser.findOne({ where: { id: session.userId, isActive: true } });
  if (!user) return null;

  return { id: user.id, email: user.email, name: user.name ?? user.email, role: user.role };
}

export async function destroyCurrentSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await AdminSession.destroy({ where: { tokenHash: hashToken(token) } });
  }
  store.delete(SESSION_COOKIE);
}

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/* ------------------------------------------------------------ login attempts */

// Per-process, in-memory. Enough to blunt online guessing on a single-instance
// deploy; a multi-instance setup would want this in Postgres or Redis.
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const LOCKOUT_MS = 15 * 60 * 1000;

export function isLockedOut(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() > entry.until) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string): void {
  const entry = attempts.get(key);
  if (entry && Date.now() <= entry.until) {
    entry.count += 1;
  } else {
    attempts.set(key, { count: 1, until: Date.now() + LOCKOUT_MS });
  }
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}
