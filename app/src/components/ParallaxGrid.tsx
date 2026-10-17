import { useEffect, useMemo, useRef, useState } from "react";
import type { GalleryItem } from "../sitedata";
import { labelFor } from "../sitedata";
import { useLightbox } from "./Lightbox";
import { prefersReducedMotion } from "../hooks/useReveal";

const BREAK_M = 700;
const BREAK_T = 1024;
const BASE: Record<number, number[]> = { 1: [0], 2: [0, 28], 3: [0, 30, 12] };
const AMP: Record<number, number[]> = { 1: [0], 2: [12, -10], 3: [18, -14, 26] };

function colTarget() {
  const w = window.innerWidth;
  return w < BREAK_M ? 1 : w < BREAK_T ? 2 : 3;
}

export type ChipDef = { label: string; filter: string[] | null };

export default function ParallaxGrid({
  items,
  chips
}: {
  items: GalleryItem[];
  chips?: ChipDef[];
}) {
  const { open } = useLightbox();
  const [active, setActive] = useState(0);
  const [cols, setCols] = useState(() => colTarget());
  const gridRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const onResize = () => setCols(colTarget());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const chipDefs = useMemo(() => {
    if (!chips || !chips.length) return [];
    const visible = chips.filter(
      (c) => c.filter === null || items.some((i) => c.filter!.includes(i.cat || ""))
    );
    return visible.length >= 2 ? visible : [];
  }, [chips, items]);

  const filter = chipDefs.length ? chipDefs[active]?.filter ?? null : null;
  const visibleItems = useMemo(
    () => (filter ? items.filter((i) => filter.includes(i.cat || "")) : items),
    [items, filter]
  );

  const columns = useMemo(() => {
    const n = cols;
    const buckets: GalleryItem[][] = Array.from({ length: n }, () => []);
    const heights = new Array(n).fill(0);
    visibleItems.forEach((it) => {
      let j = 0;
      for (let k = 1; k < n; k++) if (heights[k] < heights[j] - 0.01) j = k;
      buckets[j].push(it);
      const ar = it.th && it.tw ? it.th / it.tw : it.h && it.w ? it.h / it.w : 1.35;
      heights[j] += ar + 0.06;
    });
    return buckets;
  }, [visibleItems, cols]);

  /* scroll parallax (same behaviour as the vanilla engine) */
  useEffect(() => {
    if (prefersReducedMotion) return;
    let ticking = false;
    const apply = () => {
      ticking = false;
      const grid = gridRef.current;
      if (!grid) return;
      const els = colRefs.current.slice(0, columns.length);
      const n = columns.length;
      if (n < 2) {
        els.forEach((c) => c && (c.style.transform = ""));
        return;
      }
      const r = grid.getBoundingClientRect();
      const ih = window.innerHeight;
      if (r.bottom < -180 || r.top > ih + 180) return;
      let p = (ih - r.top) / (ih + r.height);
      p = Math.max(0, Math.min(1, p)) - 0.5;
      const base = BASE[n] || BASE[3];
      const amp = AMP[n] || AMP[3];
      els.forEach((c, i) => {
        if (!c) return;
        const y = (base[i] || 0) + p * 2 * (amp[i] || 0);
        c.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [columns]);

  const list = useMemo(
    () => visibleItems.map((it) => ({ full: it.full, thumb: it.thumb, label: labelFor(it) })),
    [visibleItems]
  );

  if (!items.length) return <p className="lede">Photos coming soon.</p>;

  return (
    <>
      {chipDefs.length > 0 && (
        <div className="chips" role="group" aria-label="Filter photographs">
          {chipDefs.map((c, i) => (
            <button
              key={c.label}
              type="button"
              className={"chip" + (i === active ? " active" : "")}
              onClick={() => setActive(i)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      <div className="grid" ref={gridRef}>
        {columns.map((col, ci) => (
          <div
            className="pcol"
            key={ci}
            ref={(el) => {
              colRefs.current[ci] = el;
            }}
          >
            {col.map((it) => {
              const idx = visibleItems.indexOf(it);
              return (
                <button
                  key={it.id}
                  type="button"
                  className="tile"
                  aria-label={"View photo: " + labelFor(it)}
                  onClick={(e) => open(list, idx, e.currentTarget)}
                >
                  <img
                    src={it.thumb}
                    alt={labelFor(it) + " — Bilal Aamer Photography"}
                    loading="lazy"
                    decoding="async"
                    width={it.tw}
                    height={it.th}
                  />
                  <span className="tile-cap">{labelFor(it)}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
