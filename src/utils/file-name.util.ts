import { capitalize } from "./text.util";

/**
 * Ambil nama file tanpa path & ekstensi
 * @param src string
 * @returns string
 */
export function getFileBasename(src: string): string {
  const s = src.replace(/\\/g, "/");
  return (
    s
      .split("/")
      .pop()
      ?.replace(/\.[^.]+$/, "") || ""
  );
}

/**
 * Normalisasi nama (kebab-case aman)
 * @param src string
 * @returns string
 */
export function normalizeFileName(src: string): string {
  return getFileBasename(src)
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Pretty name untuk alt / caption
 * @param src string
 * @returns string
 */
export function prettifyFileName(src: string): string {
  const norm = normalizeFileName(src);
  if (!norm) return "";
  return norm
    .split("-")
    .map((word) => (word === "x" ? "x" : capitalize(word)))
    .join(" ");
}
