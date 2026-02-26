import type { ImageMetadata } from "astro"

/**
 * Glob sekali
 * Menggunakan eager untuk memastikan data tersedia segera
 */
const allImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/**/*.{gif,jpg,png,jpeg,svg,webp}",
  {
    eager: true,
  }
)

/**
 * Indeks
 * Peta berdasarkan folder -> daftar gambar dengan path sumbernya
 */
type ImageWithSource = {
  sourcePath: string // Path file asli /src/assets/...
  image: ImageMetadata
}

const imagesByFolder: Record<string, ImageWithSource[]> = {}

for (const [path, mod] of Object.entries(allImages)) {
  const match = path.match(/\/src\/assets\/([^/]+)/)
  if (!match) continue

  const folder = match[1]
  ;(imagesByFolder[folder] ??= []).push({
    sourcePath: path,
    image: mod.default,
  })
}

/**
 * Urutkan gambar per folder untuk memastikan urutan yang deterministik
 */
for (const key of Object.keys(imagesByFolder)) {
  imagesByFolder[key].sort((a, b) => a.sourcePath.localeCompare(b.sourcePath))
}

/* ======================================================
   API
====================================================== */

/**
 * Ambil satu gambar berdasarkan full path
 * @param src Path lengkap gambar (misal: /src/assets/folder/gambar.jpg)
 * @return ImageMetadata atau undefined jika tidak ditemukan
 */
export const getImageByPath = (src: string): ImageMetadata => {
  const normalizedSrc = src.startsWith("/") ? src : `/${src}`
  return allImages[normalizedSrc].default
}

/**
 * Ambil semua gambar di dalam folder
 * @param folder id/nama folder di dalam /src/assets/ atau full path
 * @returns Array ImageMetadata
 */
export const getImagesByFolder = (folder: string): ImageMetadata[] => {
  // Ekstrak nama folder level pertama jika input berupa full path
  // Supports: "folder", "/src/assets/folder", "src/assets/folder", "folder/subfolder"
  const match = folder.match(/^(?:\/?src\/assets\/)?([^/]+)/)
  const key = match ? match[1] : folder

  return (imagesByFolder[key] ?? []).map(item => item.image)
}

/**
 * Ambil semua gambar di dalam 1 atau lebih folder
 * @param folders id/nama folder di dalam /src/assets/
 * @returns Array ImageMetadata
 */
export const getImagesByFolders = (folders: string | string[]): ImageMetadata[] => {
  const list = Array.isArray(folders) ? folders : [folders]
  return list.flatMap(folder => getImagesByFolder(folder))
}

/**
 * Ambil semua gambar di dalam folder yang diawali dengan prefiks
 * @param folder id/nama folder di dalam /src/assets/
 * @param id Prefiks nama berkas
 * @returns Array ImageMetadata
 */
export const getImagesById = (folder: string, id: string): ImageMetadata[] => {
  // Cari berdasarkan SOURCE PATH asli, bukan src keluaran yang di-hash
  // Contoh path: /src/assets/produk/DIYYK01.jpg
  return (imagesByFolder[folder] ?? [])
    .filter(item => {
      // Periksa apakah nama file (bagian dari sourcePath) mengandung prefiks
      // Fokus pada bagian nama file untuk menghindari kecocokan yang tidak disengaja di folder
      const parts = item.sourcePath.split("/")
      const filename = parts[parts.length - 1]
      return filename.includes(id)
    })
    .map(item => item.image)
}
