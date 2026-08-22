import { NextRequest, NextResponse } from "next/server";
import { AdminUser } from "@/models";
import {
  verifyPassword, createSession, setSessionCookie,
  isLockedOut, recordFailedAttempt, clearAttempts,
} from "@/lib/auth";
import { recordAudit } from "@/services/admin.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Deliberately vague: distinguishing "no such user" from "wrong password" tells
// an attacker which emails are real.
const GENERIC = "That email and password combination didn't work.";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected a JSON body." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: GENERIC }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isLockedOut(`${ip}:${email}`)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  try {
    const user = await AdminUser.findOne({ where: { email } });

    // Run the hash comparison even when the user is missing, so a failed login
    // takes the same time either way.
    const stored = user?.passwordHash ?? "scrypt$00$00";
    const valid = await verifyPassword(password, stored);

    if (!user || !valid || !user.isActive) {
      recordFailedAttempt(`${ip}:${email}`);
      return NextResponse.json({ ok: false, error: GENERIC }, { status: 401 });
    }

    clearAttempts(`${ip}:${email}`);

    const { token, expiresAt } = await createSession(user.id, {
      ip,
      userAgent: req.headers.get("user-agent"),
    });
    await setSessionCookie(token, expiresAt);

    await user.update({ lastLoginAt: new Date() });
    await recordAudit({ userId: user.id, action: "login", entity: "AdminUser", entityId: user.id });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/auth/login]", err);
    return NextResponse.json({ ok: false, error: "Login failed. Please try again." }, { status: 500 });
  }
}
