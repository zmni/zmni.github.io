/**
 * Ambil nama file tanpa path dan ekstensi.
 */
export const basename = (path: string): string => {
  const name = path.split("/").pop() || "";
  return name.includes(".") ? name.split(".").slice(0, -1).join(".") : name;
};

/**
 * Kapitalisasi huruf pertama saja.
 * "hello world" -> "Hello world"
 */
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Kapitalisasi setiap awal kata (Title Case).
 * "hello astro world" -> "Hello Astro World"
 */
export const capitalizeAll = (str: string): string => {
  return str
    .split(/[\s-_]+/) // Split berdasarkan spasi, dash, atau underscore
    .map((word) => capitalize(word.toLowerCase()))
    .join(" ");
};

/**
 * Slugify: Mengubah string menjadi format URL-friendly (kebab-case).
 * Menangani karakter spesial, emoji, dan aksen.
 */
export const slugify = (str: string): string => {
  return str
    .normalize("NFD") // Dekomposisi unicode (hapus aksen)
    .replace(/[\u0300-\u036f]/g, "") // Hapus karakter diakritik
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Hapus karakter non-alfanumerik kecuali spasi/dash
    .trim()
    .replace(/\s+/g, "-") // Spasi jadi dash
    .replace(/-+/g, "-") // Hapus dash ganda
    .toLowerCase();
};

/**
 * Unslugify: Kebalikan dari slugify.
 * "artikel-belajar-astro" -> "Artikel Belajar Astro"
 */
export const unslugify = (str: string): string => {
  return capitalizeAll(str.replace(/-/g, " "));
};

/**
 * Truncate: Memotong string yang terlalu panjang.
 * Bermanfaat untuk meta description atau card summary.
 */
export const truncate = (str: string, length: number = 160): string => {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + "...";
};

/**
 * Prettify untuk Alt Text Gambar
 */
export const prettyImgAlt = (path: string): string => {
  return unslugify(basename(path));
};
