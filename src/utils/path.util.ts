/**
 * Konversi pathname menjadi id
 * @param pathname string
 * @returns string
 */
export function pathToId(pathname: string): string {
  const segmen = pathname.split("/").filter(Boolean);
  return segmen.at(-1) ?? "beranda";
}
