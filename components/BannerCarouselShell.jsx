"use client";

import { useEffect, useState } from "react";
import BannerCarousel from "@/components/BannerCarousel";

export default function BannerCarouselShell({ slides }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="carousel-shell carousel-fallback">
        <a href={slides[0]?.href ?? "#annadaan"} className="carousel-slide">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet={slides[0]?.mobileSrc ?? slides[0]?.src}
            />
            <img
              src={slides[0]?.src ?? "/banners/5-billion-meals-desktop.webp"}
              alt={slides[0]?.alt ?? "Festival banner"}
              className="carousel-image"
            />
          </picture>
        </a>
      </div>
    );
  }

  return <BannerCarousel slides={slides} />;
}
