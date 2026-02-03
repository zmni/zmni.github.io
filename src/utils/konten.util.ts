import type { KontenType } from "../data/types";
import { pathToId } from "./path.util";
import { konten } from "../data/konten";

/**
 * Objek konten berdasarkan id
 */
const kontenById: Record<string, KontenType> = Object.fromEntries(
  konten.map((k: KontenType) => [k.id, k])
);

/**
 * Ambil konten berdasarkan id
 * @param id string
 * @returns KontenType
 */
export function getKontenById(id: string): KontenType {
  return kontenById[id];
}

/**
 * Ambil konten berdasarkan array id
 * @param ids string | string[]
 * @returns KontenType[]
 */
export function getKontenByIds(ids: string | string[]): KontenType[] {
  const list: string[] = Array.isArray(ids) ? ids : [ids];
  return list.map((id) => getKontenById(id)).filter(Boolean);
}

/**
 * Ambil konten berdasarkan path
 * @param path string
 * @returns KontenType
 */
export function getKontenByPath(path: string): KontenType {
  return kontenById[pathToId(path)];
}
