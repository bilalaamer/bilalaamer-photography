"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/effect-cards";

import { cn } from "@/lib/utils";

/**
 * Skiper 49 Carousel_003 — React + Swiper (Inverted perspective carousel)
 *
 * Adaptation for this site (kept as close to the original as possible):
 * - an optional `onSelect` callback was added so clicking the visible slide
 *   opens the full-screen photo viewer
 * - photos keep their original aspect ratio; a blurred copy of the same photo
 *   fills the slide behind the image
 * - dark-theme pagination bullets, rounded slides, taller stage
 * - the example data in the demo export uses placeholder paths (unused here)
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 */
const Skiper49 = () => {
  const images = [
    { src: "/images/x.com/13.jpeg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/images/x.com/32.jpeg", alt: "Illustrations by my fav AarzooAly" }
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <Carousel_003 className="" images={images} showPagination loop />
    </div>
  );
};

export { Skiper49 };

const Carousel_003 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
  onSelect,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
  onSelect?: (index: number) => void;
}) => {
  const css = `
  .Carousal_003 {
    width: 100%;
    height: 440px;
    padding-bottom: 50px !important;
  }

  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    border-radius: 16px;
    overflow: hidden;
  }

  .swiper-pagination-bullet {
    background-color: #d8b877 !important;
  }
`;
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.3
      }}
      className={cn("relative w-full max-w-4xl px-5", className)}
    >
      <style>{css}</style>

      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 1500,
                  disableOnInteraction: true
                }
              : false
          }
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          }}
          pagination={
            showPagination
              ? {
                  clickable: true
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev"
                }
              : false
          }
          className="Carousal_003"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="">
              <div
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
                className="relative h-full w-full cursor-pointer overflow-hidden bg-neutral-900"
              >
                <img
                  src={image.src}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
                />
                <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
                <img
                  className="relative z-10 h-full w-full object-contain"
                  src={image.src}
                  alt={image.alt}
                  draggable={false}
                />
              </div>
            </SwiperSlide>
          ))}
          {showNavigation && (
            <div>
              <div className="swiper-button-next after:hidden">
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </div>
              <div className="swiper-button-prev after:hidden">
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </Swiper>
      </motion.div>
    </motion.div>
  );
};

export { Carousel_003 };

/**
 * Skiper 49 Carousel_003 — React + Swiper
 * Built with Swiper.js - Read docs to learn more https://swiperjs.com/
 * Illustrations by AarzooAly - https://x.com/AarzooAly
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
