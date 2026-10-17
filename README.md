# Bilal Aamer Photography

Portfolio website for **Bilal Aamer Photography** — a Dubai-based photographer covering
weddings and celebrations, automobile shoots, pets and corporate events across the UAE.

**Live site:** _add your hosted URL here_ (e.g. `https://bilalaamer.netlify.app`)

## Pages

- **Home** — hero (rotating banner), "Selected Work" 3D reveal grid (randomly shuffled on
  every visit), Celebrations / Automobile / Pets feature strips, services, about, contact
- **Celebrations** (`#/weddings`) — GSAP card-stack scroll gallery
- **Automobile** (`#/automobile`) — parallax depth showcase + sticky scroll-reveal gallery
- **Pets** (`#/pets`) — card-stack scroll gallery

Every photo opens in a full-screen viewer: thumbnail filmstrip, tap/click-to-zoom, swipe,
keyboard navigation, and a zoom-from-tile open animation.

## Tech stack

- **React 19 + TypeScript**, **Vite 7**, **Tailwind CSS v4**
- **Framer Motion**, **GSAP + ScrollTrigger**, **Lenis**, **Swiper**
- Genuine [Skiper UI](https://skiper-ui.com) gallery components (free license — credited
  in the site footer)
- PowerShell image pipeline (EXIF-safe resizing → thumbnails, gallery and hero sizes)
- Builds to a **single self-contained HTML file** — opens by double-click, no server needed

Details: [TECHSTACK.md](TECHSTACK.md) · Project journal & handoff: [PROJECT-NOTES.md](PROJECT-NOTES.md)

## Photo workflow

Drop photos into the matching folder under `photos/` and double-click **`Update Website.cmd`**:

| Folder | Used for |
|---|---|
| `Main page/` | Home hero — all photos rotate every 8 s |
| `Weddings/` | Celebrations gallery (optional subfolders: Bride, Groom, Couple, Ceremony, Decor, Candid, Family) |
| `Automobile/` | Automobile showcase + scroll gallery |
| `Pets/` | Pets gallery |
| `Portfolio/` | Home "Selected Work" grid |
| `About/` | About-section photo |

Photos are processed locally (JPG/PNG only). The raw photo folders are intentionally
**not** part of this repository.

## Development

Requires Node.js (a portable copy lives at `E:\tools\node` on the author's machine).

```bash
cd app
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build → app/dist (single-file index.html)
```

## Credits

- Gallery motion inspired by [Skiper UI](https://skiper-ui.com) — attribution required by
  their free license
- Fonts: Cormorant Garamond & Jost (Google Fonts, SIL OFL)
- React, Vite, Tailwind CSS, Framer Motion, GSAP, Lenis, Swiper (MIT licenses)
