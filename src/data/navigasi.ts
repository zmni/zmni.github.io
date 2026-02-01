import type { NavigasiType } from "./types";

export const navigasi: NavigasiType[] = [
  {
    id: "beranda",
    label: "Beranda",
    href: "/"
  },
  {
    id: "layanan",
    label: "Layanan",
    href: "/#layanan"
  },
  {
    id: "billboard",
    label: "Billboard",
    href: "/billboard/",
    subnav: [
      {
        id: "4x6",
        label: "Billboard » 4x6",
        href: "/billboard/?ukuran=4x6"
      },
      {
        id: "6x8",
        label: "Billboard » 6x8",
        href: "/billboard/?ukuran=6x8"
      },
      {
        id: "5x10",
        label: "Billboard » 5x10",
        href: "/billboard/?ukuran=5x10"
      }
    ]
  },
  {
    id: "portofolio",
    label: "Portofolio",
    href: "/#portofolio"
  },
  {
    id: "klien",
    label: "Klien",
    href: "/#klien"
  },
  {
    id: "kontak",
    label: "Kontak",
    href: "/#kontak"
  }
];
