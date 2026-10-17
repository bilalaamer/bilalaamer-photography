"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Skiper 34 StickyCard_003 — React + framer motion (Scroll images reveal 003)
 *
 * Adaptation for this site (kept as close to the original as possible):
 * - `images` and an `onSelect` (open the photo viewer) callback are passed in as props
 * - the demo caption and the ReactLenis wrapper were removed (this page already runs
 *   a single Lenis root via the Skiper30 component)
 * - cards are horizontal stages; photos keep their original aspect ratio and any
 *   empty space is filled with a blurred copy of the same photo behind the image
 * - safe initial state so cards are visible before the first scroll event
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 */
const Skiper34 = ({
  images,
  onSelect,
}: {
  images: string[];
  onSelect?: (index: number) => void;
}) => {
  return (
    <section className="relative flex w-full flex-col items-center gap-[4vh] px-4 pt-[4vh]">
      {images.map((img, idx) => (
        <StickyCard_003 key={idx} imgUrl={img} index={idx} onSelect={onSelect} />
      ))}
    </section>
  );
};

const StickyCard_003 = ({
  imgUrl,
  index,
  onSelect,
}: {
  imgUrl: string;
  index: number;
  onSelect?: (index: number) => void;
}) => {
  const vertMargin = 10;
  const container = useRef<HTMLDivElement>(null);
  const [maxScrollY, setMaxScrollY] = useState<number | null>(null);

  const filter = useMotionValue(0);
  const negateFilter = useTransform(filter, (value) => -value);

  const { scrollY } = useScroll({
    target: container,
  });
  const start = maxScrollY ?? 1e9;
  const scale = useTransform(scrollY, [start, start + 10000], [1, 0]);
  const isInView = useInView(container, {
    margin: `0px 0px -${100 - vertMargin}% 0px`,
    once: true,
  });

  scrollY.on("change", (latest) => {
    let animationValue = 1;
    if (maxScrollY !== null && latest > maxScrollY) {
      animationValue = Math.max(0, 1 - (latest - maxScrollY) / 10000);
    }

    scale.set(animationValue);
    filter.set((1 - animationValue) * 100);
  });

  useEffect(() => {
    if (isInView && maxScrollY === null) {
      setMaxScrollY(scrollY.get());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <motion.div
      ref={container}
      role="button"
      tabIndex={0}
      aria-label="Open photo"
      onClick={() => onSelect?.(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(index);
        }
      }}
      className="sticky h-[200px] w-full max-w-6xl cursor-pointer overflow-hidden rounded-4xl bg-neutral-900"
      style={{
        scale: scale,
        rotate: filter,
        height: `${100 - 2 * vertMargin}vh`,
        top: `${vertMargin}vh`,
      }}
    >
      <motion.div
        style={{ rotate: negateFilter }}
        className="absolute inset-0 h-full w-full"
      >
        <img
          src={imgUrl}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
        />
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        <img
          src={imgUrl}
          alt="Automobile photography — Bilal Aamer Photography"
          draggable={false}
          className="relative z-10 h-full w-full object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

export { Skiper34, StickyCard_003 };
