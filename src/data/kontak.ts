import type { KontakType } from "./types";

export const kontak: ReadonlyArray<Readonly<KontakType>> = [
  {
    id: "kantor-1",
    label: "Kantor 1:",
    lokasi: "Jl. Tegal Watu, Gambiran UH 5, no.277b, Yogyakarta, DI Yogyakarta, 55161",
    href: "https://maps.app.goo.gl/9pCvvpz4Z6x63Zmi9",
    ikon: "geo-alt"
  },
  {
    id: "kantor-2",
    label: "Kantor 2:",
    lokasi: "[ placeholder for alamat kantor 2 ]",
    href: "https://maps.app.goo.gl/9pCvvpz4Z6x63Zmi9",
    ikon: "geo-alt"
  },
  {
    id: "surel",
    label: "Surel:",
    lokasi: "bintangsuryamadani@gmail.com",
    href: "mailto:bintangsuryamadani@gmail.com",
    ikon: "envelope"
  },
  {
    id: "telepon",
    label: "Telepon:",
    lokasi: "+62 813 2803 0870",
    href: "tel:+628123456789",
    ikon: "telephone"
  },
  {
    id: "whatsapp",
    label: "WhatsApp:",
    lokasi: "+62 813 2803 0870",
    href: "https://wa.me/6281328030870",
    ikon: "whatsapp"
  }
];

export const medsos: ReadonlyArray<Readonly<KontakType>> = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/bintang.suryamadani/"
  },
  {
    id: "tiktok",
    label: "Tiktok",
    href: "https://www.tiktok.com/"
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/"
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/"
  },
  {
    id: "threads",
    label: "Threads",
    href: "https://www.threads.com/"
  },
  {
    id: "x",
    label: "X/Twitter",
    href: "https://x.com/"
  }
];
