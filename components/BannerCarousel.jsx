"use client";

import { useEffect, useRef, useState } from "react";

export default function BannerCarousel({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isSwipingRef = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goToPrev = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 12) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < 50) {
      return;
    }

    if (deltaX > 0) {
      goToPrev();
      return;
    }

    goToNext();
  };

  const handleClickCapture = (event) => {
    if (!isSwipingRef.current) {
      return;
    }

    event.preventDefault();
    isSwipingRef.current = false;
  };

  return (
    <div
      className="carousel-shell"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <a
            key={slide.src}
            href={slide.href}
            className="carousel-slide"
            onClickCapture={handleClickCapture}
          >
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
    </div>
  );
}
