import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";

/**
 * Password hashing only — deliberately free of any Next.js coupling so the
 * `admin:create` CLI script can import it outside a server bundle.
 *
 * scrypt is in Node's standard library, so there is no native module to build
 * on deploy. Stored as `scrypt$<salt-hex>$<hash-hex>`.
 */

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number
) => Promise<Buffer>;

const KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEYLEN);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const derived = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);

  // Constant-time: a plain === would leak how much of the hash matched.
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}
