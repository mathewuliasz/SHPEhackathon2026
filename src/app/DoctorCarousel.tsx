"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const doctors = [
  { name: "Dr. Elena Ruiz", specialty: "Family Care", rating: 4.9, count: 128 },
  { name: "Dr. Marcus Lee", specialty: "Internal Medicine", rating: 4.8, count: 94 },
  { name: "Dr. Nina Patel", specialty: "Urgent Care", rating: 4.9, count: 156 },
] as const;

export function DoctorCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    scrollToIndex(1);
  }, []);

  function scrollToIndex(index: number) {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const safeIndex = Math.max(0, Math.min(index, doctors.length - 1));
    const slide = container.children[safeIndex] as HTMLElement | undefined;

    if (!slide) {
      return;
    }

    slide.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    setActiveIndex(safeIndex);
  }

  function handleScroll() {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const center = container.scrollLeft + container.clientWidth / 2;
    let nextIndex = activeIndex;
    let bestDistance = Number.POSITIVE_INFINITY;

    Array.from(container.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const childCenter = element.offsetLeft + element.clientWidth / 2;
      const distance = Math.abs(center - childCenter);

      if (distance < bestDistance) {
        bestDistance = distance;
        nextIndex = index;
      }
    });

    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  }

  return (
    <section className={styles.carouselSection} aria-label="Available doctors">
      <div className={styles.carouselControls}>
        <button
          type="button"
          className={styles.carouselButton}
          onClick={() => scrollToIndex(activeIndex - 1)}
          aria-label="Show previous doctor"
        >
          ←
        </button>

        <div className={styles.carouselDots} aria-hidden="true">
          {doctors.map((doctor, index) => (
            <span
              key={doctor.name}
              className={`${styles.carouselDot} ${
                index === activeIndex ? styles.carouselDotActive : ""
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.carouselButton}
          onClick={() => scrollToIndex(activeIndex + 1)}
          aria-label="Show next doctor"
        >
          →
        </button>
      </div>

      <div
        ref={scrollRef}
        className={styles.carouselViewport}
        onScroll={handleScroll}
      >
        {doctors.map((doctor, index) => (
          <article
            key={doctor.name}
            className={`${styles.carouselSlide} ${
              index === activeIndex ? styles.carouselSlideActive : ""
            }`}
          >
            <div
              className={`${styles.avatar} ${
                index === activeIndex ? styles.avatarLarge : ""
              }`}
            />
            <div>
              <strong>{doctor.name}</strong>
              <span>{doctor.specialty}</span>
              <div className={styles.doctorRating}>
                <span>★</span>
                <strong>{doctor.rating}</strong>
                <span className={styles.doctorRatingCount}>({doctor.count})</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
