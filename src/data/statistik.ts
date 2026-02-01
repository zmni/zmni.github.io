import type { StatistikType } from "./types";

export const statistik: ReadonlyArray<Readonly<StatistikType>> = [
  {
    id: "stat-tahun",
    label: "Tahun",
    final: 10,
    gambar: "https://picsum.photos/id/69/768/576"
  },
  {
    id: "stat-titik",
    label: "Titik di Indonesia",
    final: 1000,
    unit: "K+",
    gambar: "https://picsum.photos/id/214/768/576"
  },
  {
    id: "stat-klien",
    label: "Klien",
    final: 500,
    gambar: "https://picsum.photos/id/815//768/576"
  },
  {
    id: "stat-rating",
    label: "Rating",
    final: 4.9,
    desimal: 1,
    gambar: "https://picsum.photos/id/619/768/576"
  },
];
