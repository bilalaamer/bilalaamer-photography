# Bilal Aamer Photography — Project Notes & Handoff

> Everything done so far, how the site works, and how to continue.
> Companion file: **`TECHSTACK.md`** (stack details + folder map).

---

## 1. What this project is

A portfolio website for **Bilal Aamer Photography** — a Dubai/UAE photographer.
Audience: UAE desi families (weddings/celebrations), corporate events, automobile
shoots, pets and outdoor sessions.

**The live site is the React app:**
`E:\bilalaamer-photography\app\dist\index.html` — a single self-contained HTML file
(≈ 640 KB) that opens by double-click, no server needed.

**Pages** (`#/` hash routes):

| Route | Page | Gallery style |
|---|---|---|
| `index.html` | Home | Skiper32-style 3D reveal grid (portfolio, randomly shuffled each load) + Celebrations/Automobile/Pets strips |
| `#/weddings` | **Celebrations** (tab renamed, route kept) | Skiper17 — GSAP card stack (Wedpics) |
| `#/automobile` | Automobile | Skiper30 parallax showcase + Skiper34 sticky scroll reveal |
| `#/pets` | Pets | Skiper17 — same card stack as Celebrations |

---

## 2. How the site evolved (chronology)

1. **v1 — Static site**: hand-built HTML/CSS/JS portfolio; photos hand-curated from
   `E:\pics\my edits` + `E:\pics\weddings` (agents reviewed ~120 images; the
   `Bilal-Ghazeefa` wedding folder was excluded on request).
2. **Folder workflow**: replaced curated images with four drop-in folders
   (`Main page`, `Weddings`, `Portfolio`, `Automobile`) + `build.ps1` image pipeline.
3. **Portraits section removed**, **Automobile tab added**.
4. **Dark theme** + custom photo viewer (filmstrip, tap-to-zoom, swipe, keyboard).
5. **Skiper UI pass**: real Skiper UI registry components ported in with attribution.
6. **Full React migration**: React 19 + TypeScript + Vite 7 + Tailwind v4 +
   Framer Motion + Lenis + GSAP; builds to a single HTML file
   (via `vite-plugin-singlefile`) so the double-click workflow still works.
   Portable Node.js installed at **`E:\tools\node`** (no admin install).
7. **Instagram/Facebook embed section** added (designed frame + official FB Page
   Plugin) — later **removed on request**; profile *links* remain in the contact
   cards and footer.
8. **Gallery iterations** (per feedback):
   - Automobile gallery → **Skiper34** sticky scroll-reveal; old masonry removed;
     stack leads with **`DSC09013-Enhanced-NR.JPG`** (red Charger rolling shot).
   - Celebrations → **Skiper17** GSAP card stack; featured strip removed;
     fixed a pinned-section overlap bug (pin-spacer now reserves the scroll room).
   - **Pets tab added** with the same Skiper17 stack.
   - All galleries: **original aspect ratio kept** + **blurred copy of the photo
     fills the empty space** (no cropping).
9. **Weddings tab renamed to “Celebrations”** (labels only; URL stays `/weddings`).
10. **Home page polish**: brand (“Bilal Aamer”) enlarged, hero text made readable on any
    background (radial scrim + text shadows), and **Automobile + Pets strips added** to
    the home page alongside the Celebrations strip (alternating image sides).
11. **Git repository initialized** (branch `main`) with a curated `.gitignore`
    (excludes `app/node_modules`, `app/dist`, generated images, and `photos/`).
    Identity: `Bilal Aamer <bilalaamer90@gmail.com>`. Remote: GitHub —
    `git@github.com:bilalaamer/-bilalaamer-photography.git` (SSH key registered;
    the repo name has a leading hyphen — rename it in GitHub settings any time
    and update the remote with `git remote set-url`).
12. **Portfolio presentation**: home "Selected Work" went through Skiper49 (coverflow
    carousel) and now uses a **3D reveal grid** recreating Skiper32 "Scroll images
    reveal 001" (the original is a **Pro** component — source is license-gated; the
    recreation lives in `app/src/components/RevealGrid3D.tsx`). Photos rotate,
    translate and fade in on scroll with randomised values and unique timing;
    shuffle on every load and click-to-open the viewer are preserved. The old
    masonry grid + its category filter chips were removed. A dedicated `About\`
    folder feeds the About image (moved out of Portfolio).

---

## 3. Daily workflow

**After adding/changing photos:**

1. Paste photos into the relevant folder under `E:\bilalaamer-photography\photos\`:
   - `Main page\` — home hero. All photos rotate every 8 s.
   - `Weddings\` — Celebrations gallery. Optional subfolders create filter sets
     (Bride, Groom, Couple, Ceremony, Decor, Candid, Family). First *bride* photo
     (else first photo) becomes the Celebrations banner.
   - `Automobile\` — takes part in showcase + scroll gallery; first photo = banner.
   - `Pets\` — pets gallery + banner.
   - `Portfolio\` — home "Selected Work" grid; first photo also becomes the About image
     (unless the `About\` folder has photos). Optional subfolders: Automotive, Outdoor,
     Nature, Events.
   - `About\` — the About-section photo (first photo wins; preferred: DSC05343). Falls
     back to the first Portfolio photo when empty.
2. Double-click **`Update Website.cmd`** — it runs the image pipeline, builds the
   React app, and opens the finished site.

**Only JPG/JPEG/PNG are supported** (convert HEIC/RAW first). Everything is
EXIF-rotation-safe and auto-resized (thumbs 640 px, gallery 1600 px, banners 2200 px).

**Developer mode:** in `app\`, run `E:\tools\node\npm.cmd run dev` (hot reload).

**Deploying the live site (GitHub Pages — live now):**
- **Live URL: https://bilalaamer.github.io/bilalaamer-photography/** (the repo is
  **public** — required for free GitHub Pages; your photos are NOT in the repo).
- Double-click **`Deploy to GitHub Pages.cmd`** → processes photos, builds the site and
  force-pushes a fresh `gh-pages` branch → live site updates in about a minute.
- Alternative: **`Make Deploy Zip.cmd`** produces `bilalaamer-site.zip` for drag-and-drop
  hosts (Netlify Drop / Cloudflare Pages) if you ever prefer those.
- **GitHub**: repo `github.com/bilalaamer/bilalaamer-photography` (description + topics
  set). GitHub CLI (`gh`) is installed at `C:\Program Files\GitHub CLI\gh.exe` and
  authenticated as `bilalaamer`. Code updates: `git add -A` → `git commit -m "..."` →
  `git push`.

---

## 4. Special wiring (things to remember)

| Behaviour | Where it's set |
|---|---|
| Automobile scroll gallery lead photo (`DSC09013-Enhanced-NR.JPG`) | `LEAD_FILE` in `app\src\pages\Automobile.tsx` (matched by source filename — survives new photos) |
| Pets banner photo (`DSC08881-Enhanced-NR.JPG` = pet-02) | Preference rule in `build.ps1` (falls back to first photo if missing) |
| Celebrations banner | First `Bride`-subfolder photo, else first wedding photo (in `build.ps1`) |
| About-section image | First `Portfolio` photo (in `build.ps1`) |
| Contact details (WhatsApp, phone, email, socials) | **`app\src\config.ts`** — single place |
| Tab labels / nav | `app\src\components\SiteHeader.tsx` + `SiteFooter.tsx` |
| Skiper UI attribution (license requirement) | Footer credit line — **must stay** |

**Contact details:**
- Email: `bilalaamer90@gmail.com` (set in `app\src\config.ts`).
- Phone/WhatsApp: `+971 58 557 3305` — taken from the watermark on your photos;
  verify it's the correct business number.

---

## 5. Key files

```
E:\bilalaamer-photography\
  Update Website.cmd            ← daily driver: process photos + build + open
  build.ps1                     ← image pipeline + data.js generator (+ hero preferences)
  TECHSTACK.md                  ← stack details
  PROJECT-NOTES.md              ← this file
  photos\                       ← YOUR photo drop folders (see §3)
  assets\img\                   ← generated web images (thumbs / full / hero)
  assets\js\data.js             ← generated manifest the app reads (do not edit)
  app\
    src\config.ts               ← contact details (EDIT THIS)
    src\pages\                  ← Home.tsx, Weddings.tsx (=Celebrations), Automobile.tsx, Pets.tsx
    src\components\             ← Lightbox.tsx (photo viewer), ParallaxGrid.tsx, Hero.tsx, header/footer…
    src\components\ui\skiper-ui\← genuine Skiper UI components (adaptation notes in each file):
                                   skiper17 (GSAP card stack), skiper30 (parallax columns),
                                   skiper34 (sticky reveal), skiper52 (hover expand — currently unused)
    public\assets\              ← synced by build.ps1 (do not edit)
    dist\index.html             ← THE SITE (built output)
  index.html / weddings.html / automobile.html
                                ← previous static version (kept as fallback, not maintained)
```

**Backups on disk:**
- `E:\bilalaamer-photography-backup-dark-theme` — dark-theme static version
- `E:\bilalaamer-photography-backup-static-final` — final static version before React

---

## 6. Photo viewer features (shared everywhere)

Full-screen viewer on any photo click: thumbnail filmstrip with auto-scroll,
tap/click-to-zoom (2.1×, zooms where you click), swipe on mobile, arrow keys +
Esc on desktop, counter + caption, preloading of neighbouring photos, and a
“zoom from tile” open animation.

---

## 7. Open items / ideas for next time

- [ ] Replace the placeholder email; confirm the WhatsApp number (`app\src\config.ts`).
- [ ] Optional: add a "Celebrations" / "Pets" service card on the home Services section.
- [ ] Optional: a Pets strip on the home page (like the Celebrations strip).
- [ ] If more live social proof is wanted later: [Behold.so](https://behold.so) free
      widget is the cleanest path for a real auto-updating Instagram feed (needs a
      one-time account connection by you, then a one-line embed).
- [ ] `skiper52` HoverExpand (full-width variant) is kept in the codebase but unused —
      easy to re-add if wanted again.
- [ ] Deploy option: the `app\dist` folder can be uploaded as-is to Netlify / Vercel /
      GitHub Pages for a public URL.

---

## 8. Continuing with an AI agent

When you open a new session, point the agent at this folder and say:
*“Read PROJECT-NOTES.md and TECHSTACK.md in E:\bilalaamer-photography, then …”*

Useful facts for the agent:
- Portable Node.js lives at `E:\tools\node` (used by `Update Website.cmd`).
- The site builds with `npm run build` inside `app\` (tsc + Vite + singlefile).
- The image pipeline is `build.ps1` (PowerShell + .NET GDI+; EXIF-safe).
- Skiper components in `app\src\components\ui\skiper-ui\` are genuine registry
  sources with clearly-marked local adaptations — don't rewrite them wholesale.
- Attribution to Skiper UI in the footer is required by their free license.
