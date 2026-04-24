"use client";

import { useEffect, useState } from "react";

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
        {slides.map((slide, index) => (
          <a key={slide.src} href={slide.href} className="carousel-slide">
            <picture>
              {slide.mobileSrc ? (
                <source media="(max-width: 640px)" srcSet={slide.mobileSrc} />
              ) : null}
              <img
                src={slide.src}
                alt={slide.alt}
                className="carousel-image"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </picture>
          </a>
        ))}
      </div>

      <div className="carousel-controls">
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
      </div>
    </div>
  );
}
