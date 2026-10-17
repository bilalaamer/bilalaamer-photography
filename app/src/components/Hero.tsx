import React, { useEffect, useState } from "react";
import type { HeroItem } from "../sitedata";
import { heroPosition } from "../sitedata";
import { prefersReducedMotion } from "../hooks/useReveal";

export default function Hero({
  images,
  short,
  eyebrow,
  title,
  sub,
  actions
}: {
  images: HeroItem[];
  short?: boolean;
  eyebrow: string;
  title: React.ReactNode;
  sub: string;
  actions: React.ReactNode;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length < 2 || prefersReducedMotion) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), 8000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <section className={"hero" + (short ? " hero-short" : "")} id="top">
      {images.length === 0 && <div className="hero-bg" />}
      {images.length === 1 && (
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url(${images[0].src})`,
            backgroundPosition: heroPosition(images[0])
          }}
        />
      )}
      {images.length > 1 &&
        images.map((im, i) => (
          <div
            key={im.id || i}
            className={"hero-bg hero-layer" + (i === idx ? " active" : "")}
            style={{
              backgroundImage: `url(${im.src})`,
              backgroundPosition: heroPosition(im)
            }}
          />
        ))}
      <div className="container">
        <p className="hero-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-sub">{sub}</p>
        <div className="hero-actions">{actions}</div>
      </div>
      <span className="hero-scroll" aria-hidden="true" />
    </section>
  );
}
