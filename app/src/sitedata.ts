export type GalleryItem = {
  id: string;
  cat?: string;
  alt?: string;
  file?: string;
  thumb: string;
  full: string;
  src?: string;
  w: number;
  h: number;
  tw?: number;
  th?: number;
};

export type HeroItem = {
  id: string;
  src: string;
  alt?: string;
  w: number;
  h: number;
};

export type SiteData = {
  heroes: {
    home?: HeroItem[] | HeroItem | null;
    wedding?: HeroItem | null;
    automobile?: HeroItem | null;
    pets?: HeroItem | null;
    about?: HeroItem | null;
  };
  portfolio: GalleryItem[] | GalleryItem;
  weddings: GalleryItem[] | GalleryItem;
  automobile: GalleryItem[] | GalleryItem;
  pets: GalleryItem[] | GalleryItem;
};

declare global {
  interface Window {
    SITE_DATA?: SiteData;
  }
}

export function toArr<T>(v: T[] | T | null | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export function loadData(): Promise<SiteData> {
  return new Promise((resolve, reject) => {
    if (window.SITE_DATA) {
      resolve(window.SITE_DATA);
      return;
    }
    const s = document.createElement("script");
    s.src = import.meta.env.BASE_URL + "assets/js/data.js";
    s.onload = () =>
      resolve(
        window.SITE_DATA || { heroes: {}, portfolio: [], weddings: [], automobile: [], pets: [] }
      );
    s.onerror = () =>
      reject(new Error("Could not load gallery data (assets/js/data.js). Run build.ps1 first."));
    document.head.appendChild(s);
  });
}

export const CAT_LABELS: Record<string, string> = {
  "p-auto": "Automotive",
  "p-outdoor": "Travel & Outdoor",
  "p-nature": "Nature",
  "p-event": "Events",
  "p-other": "Portfolio",
  "a-shoot": "Automobile Shoot",
  "pet-shoot": "Pets",
  "w-bride": "The Bride",
  "w-groom": "The Groom",
  "w-couple": "Together",
  "w-ceremony": "Ceremony",
  "w-decor": "Details & Decor",
  "w-candid": "Candid",
  "w-family": "Family",
  "w-other": "Wedding"
};

export function labelFor(item: GalleryItem): string {
  return CAT_LABELS[item.cat || ""] || "Photograph";
}

export function heroPosition(item: HeroItem | GalleryItem | null | undefined): string {
  if (!item || !item.w || !item.h) return "center";
  return item.h > item.w * 1.05 ? "center 26%" : "center 48%";
}
