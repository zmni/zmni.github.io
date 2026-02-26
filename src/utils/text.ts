// Ambil basename berkas
export const basename = (path: string): string => {
  const name = path.split("/").pop() || ""
  return name.includes(".") ? name.split(".").slice(0, -1).join(".") : name
}

// Kapitalisasi huruf pertama saja
export const capitalize = (str: string): string => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Kapitalisasi setiap awal kata (Judul)
export const capitalizeAll = (str: string): string => {
  return str
    .split(/[\s-_]+/) // Split berdasarkan spasi, dash, atau underscore
    .map(word => capitalize(word.toLowerCase()))
    .join(" ")
}

// Slugify: Mengubah string menjadi format URL-friendly (kebab-case)
export const slugify = (str: string): string => {
  return str
    .normalize("NFD") // dekomposisi unicode (hapus aksen)
    .replace(/[\u0300-\u036f]/g, "") // hapus karakter diakritik
    .replace(/[^a-zA-Z0-9\s-]/g, "") // hapus karakter non-alfanumerik kecuali spasi/dash
    .trim()
    .replace(/\s+/g, "-") // spasi jadi dash
    .replace(/-+/g, "-") // hapus dash ganda
    .toLowerCase()
}

// Unslugify: kebalikannya dari slugify
export const unslugify = (str: string): string => {
  return capitalizeAll(str.replace(/-/g, " "))
}

// Truncate: memotong string yang terlalu panjang
export const truncate = (str: string, length: number = 160): string => {
  if (str.length <= length) return str
  return str.slice(0, length - 3).trim() + "..."
}

// Prettify untuk teks alt gambar
export const prettyImgAlt = (path: string): string => {
  return unslugify(basename(path))
}
