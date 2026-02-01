import type { NavigasiType } from "@/data/types";
import { navigasi } from "@/data/navigasi";

/**
 * Meratakan navigasi
 * @param nav NavigasiType
 * @returns NavigasiType[]
 */
function flattenNav(nav: NavigasiType[]): NavigasiType[] {
  return nav.flatMap((item: NavigasiType) => {
    if (item.subnav) {
      return [item, ...flattenNav(item.subnav)];
    }
    return [item];
  });
}

/**
 * Objek navigasi berdasarkan id
 */
const navById: Record<string, NavigasiType> = Object.fromEntries(
  flattenNav(navigasi).map((n: NavigasiType) => [n.id, n])
);

/**
 * Ambil navigasi object berdasarkan id
 * @param id string
 * @returns NavigasiType
 */
export function getNavById(id: string): NavigasiType {
  return navById[id];
}

/**
 * Mengecek apakah item navigasi aktif
 * @param pathname string
 * @param item NavigasiType
 * @returns boolean
 */
export function isNavActive(pathname: string, item: NavigasiType): boolean {
  const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

  const current = normalize(pathname);
  const target = normalize(item.href);

  // Jika halaman saat ini adalah halaman utama
  if (current === target) return true;

  // Jika halaman saat ini adalah halaman anak
  if (item.href !== "/" && current.startsWith(target)) return true;

  // Jika halaman saat ini adalah halaman anak dari halaman anak
  const children = Object.values(item).find(Array.isArray) as NavigasiType[] | undefined;
  if (children?.some((child) => isNavActive(pathname, child))) return true;

  return false;
}
