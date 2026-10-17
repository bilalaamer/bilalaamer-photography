import { useEffect, useMemo, useRef } from "react";
import type { GalleryItem } from "../sitedata";
import { labelFor } from "../sitedata";
import { useLightbox } from "./Lightbox";
import { prefersReducedMotion } from "../hooks/useReveal";

/**
 * 3D reveal grid — a recreation of Skiper UI's "Scroll images reveal 001"
 * (skiper32). The original is a Pro component whose source is not publicly
 * available, so this implements the same effect in this codebase's style:
 * a 3D grid where every photo rotates, translates and fades in on scroll
 * with randomised values and unique timing per image.
 *
 * License & Usage (per Skiper UI): attribution to Skiper UI is required when
 * using the free version — the site footer carries the credit line.
 */

type Rand = {
  rx: string;
  ry: string;
  ty: string;
  sc: string;
  dur: string;
  delay: string;
};

export default function RevealGrid3D({ items }: { items: GalleryItem[] }) {
  const { open } = useLightbox();
  const tileRefs = useRef<Array<HTMLDivElement | null>>([]);

  /* randomised 3D reveal values — one set per mount, unique per image */
  const rand = useMemo<Rand[]>(() => {
    return items.map(() => ({
      rx: (Math.random() * 26 - 13).toFixed(1),
      ry: (Math.random() * 26 - 13).toFixed(1),
      ty: (30 + Math.random() * 90).toFixed(0),
      sc: (0.86 + Math.random() * 0.1).toFixed(3),
      dur: (0.9 + Math.random() * 0.6).toFixed(2),
      delay: (Math.random() * 0.35).toFixed(2)
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  useEffect(() => {
    const els = tileRefs.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  if (!items.length) return <p className="lede">Photos coming soon.</p>;

  const list = items.map((it) => ({ full: it.full, thumb: it.thumb, label: labelFor(it) }));

  return (
    <div className="r3d-grid">
      {items.map((it, i) => (
        <div
          key={it.id}
          ref={(el) => {
            tileRefs.current[i] = el;
          }}
          className="r3d-item"
          style={
            {
              "--rx": rand[i].rx + "deg",
              "--ry": rand[i].ry + "deg",
              "--ty": rand[i].ty + "px",
              "--sc": rand[i].sc,
              "--dur": rand[i].dur + "s",
              "--delay": rand[i].delay + "s"
            } as React.CSSProperties
          }
        >
          <button
            type="button"
            className="tile"
            aria-label={"View photo: " + labelFor(it)}
            onClick={(e) => open(list, i, e.currentTarget)}
          >
            <img
              src={it.thumb}
              alt={labelFor(it) + " — Bilal Aamer Photography"}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="r3d-img"
            />
            <span className="tile-cap">{labelFor(it)}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
