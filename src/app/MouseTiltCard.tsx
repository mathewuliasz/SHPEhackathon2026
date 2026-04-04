"use client";

import type { CSSProperties, ReactNode } from "react";
import { useRef, useState } from "react";
import styles from "./page.module.css";

type MouseTiltCardProps = {
  children: ReactNode;
  className?: string;
  glareClassName?: string;
};

export function MouseTiltCard({
  children,
  className,
  glareClassName,
}: MouseTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({
    "--tilt-x": "0deg",
    "--tilt-y": "0deg",
    "--glare-x": "50%",
    "--glare-y": "50%",
  } as CSSProperties);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;
    const rotateY = (relativeX - 0.5) * 14;
    const rotateX = (0.5 - relativeY) * 14;

    setStyle({
      "--tilt-x": `${rotateX.toFixed(2)}deg`,
      "--tilt-y": `${rotateY.toFixed(2)}deg`,
      "--glare-x": `${(relativeX * 100).toFixed(2)}%`,
      "--glare-y": `${(relativeY * 100).toFixed(2)}%`,
    } as CSSProperties);
  }

  function handleLeave() {
    setStyle({
      "--tilt-x": "0deg",
      "--tilt-y": "0deg",
      "--glare-x": "50%",
      "--glare-y": "50%",
    } as CSSProperties);
  }

  return (
    <div
      ref={cardRef}
      className={`${styles.tiltCard}${className ? ` ${className}` : ""}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className={styles.tiltCardInner}>{children}</div>
      <div
        aria-hidden="true"
        className={`${styles.tiltCardGlare}${glareClassName ? ` ${glareClassName}` : ""}`}
      />
    </div>
  );
}
