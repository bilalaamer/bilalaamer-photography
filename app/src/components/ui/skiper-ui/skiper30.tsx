"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

/**
 * Skiper 30 Parallax_002 — React + framer motion + lenis
 *
 * Adaptation for this site (kept as close to the original as possible):
 * - `images` is passed in as a prop instead of the demo image list
 * - the demo intro/outro spacer sections were removed
 * - Lenis is destroyed on unmount
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 *
 * Author: @gurvinder-singh02 · Website: https://gxuri.me
 */
const COL_TOP = ["-top-[45%]", "-top-[95%]", "-top-[45%]", "-top-[75%]"];

const Skiper30 = ({ images }: { images: string[] }) => {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"]
  });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const lenis = new Lenis();

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    rafId = requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const cols: string[][] = [[], [], [], []];
  images.forEach((src, i) => cols[i % 4].push(src));

  return (
    <div
      ref={gallery}
      className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-[#0b0a08] p-[2vw]"
    >
      <Column images={cols[0]} y={y} n={0} />
      <Column images={cols[1]} y={y2} n={1} />
      <Column images={cols[2]} y={y3} n={2} />
      <Column images={cols[3]} y={y4} n={3} />
    </div>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
  n: number;
};

const Column = ({ images, y, n }: ColumnProps) => {
  return (
    <motion.div
      className={`relative ${COL_TOP[n % 4]} flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw]`}
      style={{ y }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden">
          <img
            src={src}
            alt="Automobile photography — Bilal Aamer Photography"
            loading="lazy"
            className="pointer-events-none h-full w-full object-cover"
          />
        </div>
      ))}
    </motion.div>
  );
};

export { Skiper30 };
