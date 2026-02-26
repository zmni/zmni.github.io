import { defineCollection } from "astro:content"
import type { CollectionEntry } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

/**
 * Produk Collection
 */
const produk = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/produk" }),
  schema: ({ image }) =>
    z.object({
      // id
      label: z.string(),

      // gambar
      gambar: image(),

      // lokasi
      alamat: z.string(),
      kabko: z.string(),
      provinsi: z.string(),
      lokasi: z.string(),

      // spesifikasi
      jenis: z.enum(["Baliho", "Billboard", "Videotron"]),
      ukuran: z.enum(["4x6", "4x8", "5x10", "6x12"]),
      orientasi: z.enum(["Horizontal", "Vertikal"]),
      lampu: z.array(z.enum(["Atas", "Bawah", "Depan", "Belakang", "Samping", "Dalam"])),
      sisi: z.number().min(1).max(5),
      arah: z.enum(["Timur", "Barat", "Selatan", "Utara"]),
    }),
})

export type ProdukType = CollectionEntry<"produk">["data"]
export type ProdukKey = keyof ProdukType

/**
 * Ekspor koleksi
 */
export const collections = { produk }
