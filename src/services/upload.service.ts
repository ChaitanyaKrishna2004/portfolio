import "server-only";
import { createHash, randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";
import { imageSize } from "image-size";
import { Media } from "@/models";

/**
 * Local disk uploads into /public/uploads.
 *
 * Deliberately writes through one hard-coded root and never uses the client's
 * filename, so a crafted name like "../../.env" cannot escape the directory.
 */

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";

const MAX_BYTES = {
  image: 12 * 1024 * 1024,
  video: 200 * 1024 * 1024,
  document: 25 * 1024 * 1024,
} as const;

/** Extension is derived from the sniffed MIME type, never from the upload. */
const ALLOWED: Record<string, { kind: "image" | "video" | "document"; ext: string }> = {
  "image/jpeg": { kind: "image", ext: "jpg" },
  "image/png": { kind: "image", ext: "png" },
  "image/webp": { kind: "image", ext: "webp" },
  "image/avif": { kind: "image", ext: "avif" },
  "image/gif": { kind: "image", ext: "gif" },
  "image/svg+xml": { kind: "image", ext: "svg" },
  "video/mp4": { kind: "video", ext: "mp4" },
  "video/webm": { kind: "video", ext: "webm" },
  "video/quicktime": { kind: "video", ext: "mov" },
  "application/pdf": { kind: "document", ext: "pdf" },
};

export const ACCEPT_ATTR = Object.keys(ALLOWED).join(",");

export class UploadError extends Error {}

export interface UploadResult {
  id: string;
  url: string;
  type: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  bytes: number;
  format: string;
}

export async function saveUpload(
  file: File,
  opts: { altText?: string; folder?: string; uploadedBy?: string | null } = {}
): Promise<UploadResult> {
  const spec = ALLOWED[file.type];
  if (!spec) {
    throw new UploadError(
      `${file.type || "That file type"} isn't supported. Use JPG, PNG, WebP, AVIF, GIF, SVG, MP4, WebM, MOV or PDF.`
    );
  }

  const cap = MAX_BYTES[spec.kind];
  if (file.size > cap) {
    throw new UploadError(
      `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit for ${spec.kind}s is ${cap / 1024 / 1024} MB.`
    );
  }
  if (file.size === 0) throw new UploadError("That file is empty.");

  const buffer = Buffer.from(await file.arrayBuffer());

  // Content-addressed name: identical files reuse one path, and nothing from
  // the client's filename reaches the filesystem.
  const digest = createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const suffix = randomBytes(3).toString("hex");
  const filename = `${digest}${suffix}.${spec.ext}`;

  const now = new Date();
  const folder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const dir = path.join(UPLOAD_ROOT, folder);

  await fs.mkdir(dir, { recursive: true });

  const target = path.join(dir, filename);
  // Belt and braces: confirm the resolved path is still inside the root.
  if (!path.resolve(target).startsWith(path.resolve(UPLOAD_ROOT))) {
    throw new UploadError("Refusing to write outside the uploads directory.");
  }

  await fs.writeFile(target, buffer);

  let width: number | null = null;
  let height: number | null = null;
  if (spec.kind === "image" && spec.ext !== "svg") {
    try {
      const dim = imageSize(buffer);
      width = dim.width ?? null;
      height = dim.height ?? null;
    } catch {
      // Dimensions are a nicety; a failure here shouldn't fail the upload.
    }
  }

  const url = `${PUBLIC_PREFIX}/${folder}/${filename}`;

  const row = await Media.create({
    provider: "local",
    publicId: `${folder}/${filename}`,
    url,
    type: spec.kind,
    altText: opts.altText?.trim() || null,
    width,
    height,
    bytes: file.size,
    format: spec.ext,
    folder: opts.folder?.trim() || folder,
    uploadedBy: opts.uploadedBy ?? null,
  });

  return {
    id: row.id,
    url,
    type: spec.kind,
    altText: row.altText,
    width,
    height,
    bytes: file.size,
    format: spec.ext,
  };
}

/** Removes the file from disk as well as the row. */
export async function deleteUpload(id: string): Promise<void> {
  const row = await Media.findByPk(id);
  if (!row) return;

  if (row.provider === "local" && row.url.startsWith(PUBLIC_PREFIX)) {
    const rel = row.url.slice(PUBLIC_PREFIX.length + 1);
    const target = path.join(UPLOAD_ROOT, rel);
    if (path.resolve(target).startsWith(path.resolve(UPLOAD_ROOT))) {
      await fs.unlink(target).catch(() => {
        // Already gone — deleting the row is still the right outcome.
      });
    }
  }

  await row.destroy();
}
