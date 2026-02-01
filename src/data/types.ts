// Base type untuk semua item
export type BaseType<T = {}> = {
  id: string;
  label: string;
} & T;

// Konten
export type KontenType = BaseType<{
  deskripsi: string;
}>;

// Navigasi
export type NavigasiType = BaseType<{
  href: string;
  subnav?: NavigasiType[];
}>;

// Kontak
export type KontakType = BaseType<{
  lokasi?: string;
  href?: string;
  ikon?: string;
}>;

// Produk
export type TProduk = BaseType<{
  readonly jenis: "Baliho" | "Billboard" | "VideoTron";
  readonly ukuran: "4x6" | "6x8" | "5x10";
  alamat?: string;
  kota?: string;
  provinsi?: string;
  lat?: number;
  lng?: number;
}>;

// Testimoni
export type TestimoniType = {
  nama: string;
  perusahaan: string;
  testimoni: string;
  foto?: string;
};

// Statistik
export type StatistikType = BaseType<{
  final: number;
  unit?: string;
  desimal?: number;
  gambar?: string;
}>;
