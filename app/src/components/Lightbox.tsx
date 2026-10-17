import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { prefersReducedMotion } from "../hooks/useReveal";

export type LBItem = { full: string; thumb?: string; label?: string };

type OpenFn = (list: LBItem[], index: number, srcEl?: HTMLElement | null) => void;

const LBContext = createContext<{ open: OpenFn }>({ open: () => {} });
export const useLightbox = () => useContext(LBContext);

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ list: LBItem[]; index: number } | null>(null);
  const srcRef = useRef<HTMLElement | null>(null);

  const open = useCallback<OpenFn>((list, index, srcEl) => {
    if (!list.length || index < 0) return;
    srcRef.current = srcEl || null;
    setState({ list, index });
  }, []);

  return (
    <LBContext.Provider value={{ open }}>
      {children}
      {state && (
        <Lightbox
          list={state.list}
          index={state.index}
          srcEl={srcRef.current}
          setIndex={(i) => setState((s) => (s ? { ...s, index: i } : s))}
          close={() => setState(null)}
        />
      )}
    </LBContext.Provider>
  );
}

function Lightbox({
  list,
  index,
  srcEl,
  setIndex,
  close
}: {
  list: LBItem[];
  index: number;
  srcEl: HTMLElement | null;
  setIndex: (i: number) => void;
  close: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const flipDone = useRef(false);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const it = list[index];

  const step = useCallback(
    (dir: number) => {
      if (list.length < 2) return;
      setIndex((index + dir + list.length) % list.length);
    },
    [index, list.length, setIndex]
  );

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step, close]);

  /* reset zoom per image */
  useEffect(() => {
    setZoomed(false);
  }, [index]);

  /* preload neighbours */
  useEffect(() => {
    [index - 1, index + 1].forEach((n) => {
      const x = list[(n + list.length) % list.length];
      if (x) {
        const im = new Image();
        im.src = x.full;
      }
    });
  }, [index, list]);

  /* filmstrip active + keep in view */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const thumbs = strip.querySelectorAll<HTMLImageElement>(".lb-thumb");
    thumbs.forEach((t, i) => t.classList.toggle("active", i === index));
    const cur = thumbs[index];
    if (cur && cur.scrollIntoView) {
      cur.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [index]);

  /* FLIP zoom-in from the clicked tile (once per open) */
  const onImgLoad = () => {
    const img = imgRef.current;
    if (flipDone.current || !img || !srcEl || prefersReducedMotion) return;
    flipDone.current = true;
    const from = srcEl.getBoundingClientRect();
    const to = img.getBoundingClientRect();
    if (!from.width || !to.width || from.width < 40) return;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const sc = Math.max(0.15, Math.min(1, from.width / to.width));
    img.style.transformOrigin = "50% 50%";
    img.style.transition = "none";
    img.style.transform = `translate(${dx}px, ${dy}px) scale(${sc})`;
    img.style.opacity = ".45";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        img.style.transition = "transform .55s cubic-bezier(.2,.7,.2,1), opacity .35s ease";
        img.style.transform = "translate(0,0) scale(1)";
        img.style.opacity = "1";
      })
    );
  };

  const onImgClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current;
    if (!img) return;
    img.style.transition = "";
    img.style.transform = "";
    if (!zoomed) {
      const r = img.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
      setZoomed(true);
    } else {
      img.style.transformOrigin = "50% 50%";
      setZoomed(false);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1 || zoomed) {
      touchRef.current = null;
      return;
    }
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.abs(dx) > 45 && Math.abs(dy) < 70) step(dx < 0 ? 1 : -1);
  };

  return (
    <div
      className={"lb" + (list.length < 2 ? " only-one" : "")}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (
          t.classList.contains("lb") ||
          t.classList.contains("lb-top") ||
          t.classList.contains("lb-stage")
        )
          close();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="lb-top">
        <span className="lb-count">
          {index + 1} · {list.length}
        </span>
        <button className="lb-close" type="button" data-lb="close" aria-label="Close" onClick={close}>
          ✕
        </button>
      </div>
      <div className="lb-stage">
        <button className="lb-btn lb-prev" type="button" data-lb="prev" aria-label="Previous photo" onClick={() => step(-1)}>
          ‹
        </button>
        <button className="lb-btn lb-next" type="button" data-lb="next" aria-label="Next photo" onClick={() => step(1)}>
          ›
        </button>
        <img
          ref={imgRef}
          key={it.full}
          className={"lb-img" + (zoomed ? " zoomed" : "")}
          src={it.full}
          alt={(it.label || "Photograph") + " — Bilal Aamer Photography"}
          onLoad={onImgLoad}
          onClick={onImgClick}
          draggable={false}
        />
        <p className="lb-cap">
          <span>{it.label || ""}</span>
        </p>
      </div>
      <div className="lb-strip" ref={stripRef} aria-label="Photo thumbnails">
        {list.map((x, i) => (
          <img
            key={i}
            className="lb-thumb"
            src={x.thumb || x.full}
            alt=""
            loading="lazy"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
