/**
 * Kapitalisasi huruf pertama dari sebuah string
 * @param str string
 * @returns string
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Kapitalisasi semua kata di dalam string
 * @param str string
 * @returns string
 */
export function capitalizeAll(str: string): string {
  return str.split(" ").map(capitalize).join(" ");
}
