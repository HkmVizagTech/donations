"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BannerCarousel({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="carousel-shell">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <a key={slide.src} href={slide.href} className="carousel-slide">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              priority
              className="carousel-image"
            />
          </a>
        ))}
      </div>

      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-nav"
          aria-label="Previous slide"
          onClick={() =>
            setActiveIndex((current) =>
              current === 0 ? slides.length - 1 : current - 1
            )
          }
        >
          ‹
        </button>

        <div className="carousel-dots">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={`carousel-dot${index === activeIndex ? " active" : ""}`}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="carousel-nav"
          aria-label="Next slide"
          onClick={() =>
            setActiveIndex((current) => (current + 1) % slides.length)
          }
        >
          ›
        </button>
      </div>
    </div>
  );
}
