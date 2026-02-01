import type { ImageMetadata } from "astro";

/* ======================================================
   GLOB SEKALI
====================================================== */
// Using eager to ensure data is available immediately
const allImages = import.meta.glob<{ default: ImageMetadata; }>(
  "/src/assets/**/*.{gif,jpg,png,jpeg,svg,webp}",
  { eager: true }
);

/* ======================================================
   INDEX
====================================================== */
// Map by folder -> list of images with their source path
interface ImageWithSource {
  sourcePath: string; // Original file path /src/assets/...
  image: ImageMetadata;
}

const imagesByFolder: Record<string, ImageWithSource[]> = {};

for (const [path, mod] of Object.entries(allImages)) {
  const match = path.match(/\/src\/assets\/([^/]+)/);
  if (!match) continue;

  const folder = match[1];
  (imagesByFolder[folder] ??= []).push({
    sourcePath: path,
    image: mod.default
  });
}

// Sort images per-folder to ensure deterministic order
for (const key of Object.keys(imagesByFolder)) {
  imagesByFolder[key].sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
}

/* ======================================================
   API
====================================================== */

export function getImagesByFolder(folder: string): ImageMetadata[] {
  return (imagesByFolder[folder] ?? []).map(item => item.image);
}

export function getImagesByFolders(folders: string | string[]): ImageMetadata[] {
  const list = Array.isArray(folders) ? folders : [folders];
  return list.flatMap(folder => getImagesByFolder(folder));
}

export function getImagesByPrefix(folder: string, id: string): ImageMetadata[] {
  // Search based on the original SOURCE PATH, not the hashed output src
  // Example path: /src/assets/billboard/DIY-YK-01-0.jpg
  const prefix = `${id}-`; // e.g. "DIY-YK-01-"

  return (imagesByFolder[folder] ?? [])
    .filter(item => {
      // Check if the filename (part of sourcePath) contains the prefix
      // We focus on the filename part to avoid accidental matches in folders
      const parts = item.sourcePath.split('/');
      const filename = parts[parts.length - 1];
      return filename.includes(prefix);
    })
    .map(item => item.image);
}
