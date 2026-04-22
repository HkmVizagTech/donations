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
        <div className="carousel-slide">
          <img
            src="/banners/5-billion-meals.webp"
            alt="5 Billion Meals banner"
            className="carousel-image"
          />
        </div>
      </div>
    );
  }

  return <BannerCarousel slides={slides} />;
}
