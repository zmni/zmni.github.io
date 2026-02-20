import { defineCollection, type CollectionEntry } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Produk Collection
 */
const produk = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/produk" }),
  schema: ({ image }) =>
    z.object({
      label: z.string().min(5),

      gambar: image(),

      // lokasi
      alamat: z.string().min(10),
      kabko: z.string().min(5),
      provinsi: z.string().min(5),
      url: z.string().url().startsWith("https://maps.app.goo.gl/"),
      lokasi: z.string(),

      // spesifikasi
      jenis: z.enum(["Baliho", "Billboard", "Videotron"]),
      ukuran: z.enum(["4x6", "4x8", "5x10", "6x12"]),
      orientasi: z.enum(["Horizontal", "Vertikal"]),
      lampu: z.array(z.enum(["Atas", "Bawah", "Depan", "Belakang", "Samping", "Dalam"])),
      sisi: z.number().min(1).max(5),
      arah: z.enum(["Timur", "Barat", "Selatan", "Utara"]),
    }),
});

export type ProdukType = CollectionEntry<"produk">["data"];
export type ProdukKey = keyof ProdukType;

/**
 * Ekspor koleksi
 */
export const collections = { produk };
