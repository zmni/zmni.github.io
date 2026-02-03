/**
 * Konversi path menjadi id
 * @param path string
 * @returns string
 */
export function pathToId(path: string): string {
  const segmen = path.split("/").filter(Boolean);
  return segmen.at(-1) ?? "beranda";
}
