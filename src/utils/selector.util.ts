/**
 * querySelector helper
 * @param selector Elemen target
 * @param scope Elemen induk
 * @returns Element or null
 */
export const $ = <T extends Element = Element>(
    selector: string,
    scope: ParentNode = document,
): T | null => scope.querySelector(selector);

/**
 * querySelectorAll helper
 * @param selector Elemen target
 * @param scope Elemen induk
 * @returns Array dari semua elemen
 */
export const $$ = <T extends Element = Element>(
    selector: string,
    scope: ParentNode = document,
): T[] => Array.from(scope.querySelectorAll(selector));