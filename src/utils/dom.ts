// $ (Single element selector)
export const $ = <T extends Element = HTMLElement>(
  selector: string,
  scope: ParentNode = document
): T | null => scope.querySelector<T>(selector)

// $$ (Multiple elements selector)
// Mengembalikan array asli sehingga bisa langsung .map(), .filter(), dll.
export const $$ = <T extends Element = HTMLElement>(
  selector: string,
  scope: ParentNode = document
): T[] => [...scope.querySelectorAll<T>(selector)]
