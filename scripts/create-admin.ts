/**
 * Creates (or updates) an admin account.
 *
 *   npm run admin:create -- --email you@example.com --password "…" --name "Your Name"
 *
 * Omit --password and one is generated and printed once.
 * Re-running with an existing email resets that account's password.
 */
import { randomBytes } from "crypto";
import { sequelize, AdminUser } from "../src/models";
import { hashPassword } from "../src/lib/password";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(`--${flag}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

/** Avoids look-alike characters so a generated password can be read aloud. */
function generatePassword(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(20);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

async function main() {
  const email = arg("email")?.trim().toLowerCase();
  const name = arg("name") ?? "Site Owner";
  const role = arg("role") ?? "owner";

  if (!email) {
    console.error('Missing --email. Example:\n  npm run admin:create -- --email you@example.com --name "Your Name"');
    process.exit(1);
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    console.error(`"${email}" doesn't look like an email address.`);
    process.exit(1);
  }

  const supplied = arg("password");
  if (supplied && supplied.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const password = supplied ?? generatePassword();
  const passwordHash = await hashPassword(password);

  await sequelize.authenticate();

  const existing = await AdminUser.findOne({ where: { email } });

  if (existing) {
    await existing.update({ passwordHash, name, role, isActive: true });
    console.log(`\nPassword reset for ${email}`);
  } else {
    await AdminUser.create({ email, passwordHash, name, role, isActive: true });
    console.log(`\nAdmin created: ${email}`);
  }

  if (!supplied) {
    console.log(`Generated password: ${password}`);
    console.log("This is shown once — store it in your password manager now.");
  }

  console.log("\nSign in at /admin/login\n");
  await sequelize.close();
}

main().catch((err) => {
  console.error("create-admin failed —", err.message);
  process.exit(1);
});
