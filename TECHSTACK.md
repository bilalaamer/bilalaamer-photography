# Tech Stack — Bilal Aamer Photography Website

## Overview

The website is a **React single-page app** (home / weddings / automobile) built with Vite and
Tailwind, using **genuine Skiper UI gallery components** from their shadcn registry
(skiper-ui.com). It builds to a **single self-contained HTML file** so it still opens by just
double-clicking — no server required. Photos are processed by a PowerShell pipeline into
web-optimized images plus a JSON manifest.

## Frontend

| Layer | Technology | Notes |
|---|---|---|
| UI framework | React 19 + TypeScript | Pages: `Home`, `Weddings`, `Automobile` |
| Routing | react-router-dom 7 (HashRouter) | `index.html#/weddings` works over `file://` |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + hand-written dark theme in `src/styles/global.css` | Design tokens, masonry, lightbox CSS |
| Animation | Framer Motion (+ Lenis smooth scroll) | Used by the Skiper components |
| Skiper UI components (genuine registry sources) | `skiper30` — **Oliver parallax** (multi-layer scroll gallery, Automobile showcase), `skiper34` — **StickyCard_003 scroll images reveal** (sticky stacking cards, Automobile gallery, click opens the photo viewer), `skiper17` — **StickyCard_002 GSAP card stack** (Weddings + Pets galleries, click opens the photo viewer), `skiper49` — **Inverted perspective carousel** (available; unused after feedback), `skiper52` — **ExpandOnHover** (available; unused). Free license; attribution in the site footer | Minimal adaptations only: props for our images, `onSelect` to open the viewer, Lenis cleanup, safe initial states, original aspect ratio + blurred-fill backgrounds, theme colors |
| Skiper32 recreation (Pro component — source is license-gated) | **3D reveal grid** in `app/src/components/RevealGrid3D.tsx` — home "Selected Work": every photo rotates/translates/fades in on scroll with randomised values and unique timing (the documented effect of Skiper32 "Scroll images reveal 001"). If a Pro license is obtained, paste the genuine source to swap in |
| Photo viewer | Custom React lightbox | Filmstrip, tap-to-zoom, swipe, keyboard, FLIP zoom-from-tile |
| Gallery engine | Custom React parallax masonry | Columns balanced by real aspect ratio, differential scroll speeds, filter chips |
| Embeds | Facebook Page Plugin iframe · Instagram profile frame with mini-feed | |
| Icons/fonts | Inline SVG · Google Fonts (Cormorant Garamond, Jost) | |

## Build & tooling

| Component | Technology | Notes |
|---|---|---|
| Bundler | Vite 7 | `npm run build` → `app/dist` |
| Single-file output | `vite-plugin-singlefile` | Inlines JS+CSS into `dist/index.html` (≈540 KB) so `file://` works |
| Node.js | Portable install at `E:\tools\node` (v24 LTS) | No admin install needed |
| Image pipeline | Windows PowerShell 5.1 + .NET GDI+ (`build.ps1`) | EXIF-orientation safe; thumbs 640 px (q76), gallery 1600 px (q80), heroes 2200 px (q82) |
| Manifest | `build.ps1` generates `assets/js/data.js` and mirrors everything into `app/public/assets/` | The app loads `window.SITE_DATA` at startup |

## Workflows

- **Update the site** (after pasting photos into `photos\...`): double-click **`Update Website.cmd`**
  → processes photos → builds React → opens the finished site.
- **View the finished site**: `app\dist\index.html` (self-contained).
- **Developer mode**: in `app\`, run `E:\tools\node\npm.cmd run dev` for a hot-reload dev server.

## Folder map

```
E:\bilalaamer-photography\
  Update Website.cmd        one-click: process photos + build site + open
  build.ps1                 image pipeline + manifest generator
  photos\                   your photo drop-in folders
    Main page\              home hero (rotates if several)
    Weddings\               wedding tab (optional subfolders: Bride, Groom, Couple, Ceremony, Decor, Candid, Family)
    Automobile\             automobile tab + parallax showcase
    Pets\                   pets tab (card stack gallery)
    Portfolio\              home "Selected Work" grid (optional subfolders: Automotive, Outdoor, Nature, Events)
    About\                  About-section photo (falls back to first Portfolio photo)
  assets\                   generated images + manifest (also consumed by the static fallback pages)
  app\                      React application
    src\pages\              Home / Weddings / Automobile
    src\components\         Lightbox, ParallaxGrid, Hero, header/footer, ui\skiper-ui (genuine Skiper components)
    src\config.ts           contact details / social links (edit this)
    public\assets\          synced generated images + data.js (do not edit)
    dist\                   built site — open index.html
  index.html, weddings.html, automobile.html   previous static version (kept as fallback)
```

## Backups

- `E:\bilalaamer-photography-backup-dark-theme` — dark-theme static version (before Skiper redesign)
- `E:\bilalaamer-photography-backup-static-final` — final static version (before React migration)

## Third-party credits

- [Skiper UI](https://skiper-ui.com) — gallery components (free license, attribution in footer)
- Google Fonts — Cormorant Garamond, Jost (SIL OFL)
- React, Vite, Tailwind CSS, Framer Motion, Lenis, Swiper — MIT licenses
