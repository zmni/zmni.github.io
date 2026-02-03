/**
 * querySelector helper
 * @param selector Elemen target
 * @param scope Elemen induk
 * @returns Element or null
 */
export function $<T extends Element = Element>(
  selector: string,
  scope: ParentNode = document
): T {
  if (typeof document === "undefined") {
    throw new Error(
      `Tidak bisa menggunakan $ dalam konteks SSG: ${selector}`
    );
  }

  const el = scope.querySelector(selector);

  if (!el) {
    throw new Error(`Elemen tidak ditemukan: ${selector}`);
  }

  return el as T;
}

/**
 * querySelectorAll helper
 * @param selector Elemen target
 * @param scope Elemen induk
 * @returns Array dari semua elemen
 */
export function $$<T extends Element = Element>(
  selector: string,
  scope: ParentNode = document
): T[] {
  return Array.from(scope.querySelectorAll(selector));
}
