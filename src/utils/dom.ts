/**
 * $ (Single element selector)
 * Meniru gaya jQuery/Bliss.js. Membiarkan browser menangani error jika el null.
 */
export const $ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document): T => {
  const el = scope.querySelector<T>(selector);

  // Gunakan console.warn dibanding throw error agar tidak menghentikan eksekusi script
  if (!el && typeof window !== "undefined") {
    console.warn(`Elemen tidak ditemukan: ${selector}`);
  }

  return el as T;
};

/**
 * $$ (Multiple elements selector)
 * Mengembalikan array asli sehingga bisa langsung .map(), .filter(), dll.
 */
export const $$ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document): T[] =>
  Array.from(scope.querySelectorAll<T>(selector));
