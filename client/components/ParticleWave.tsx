"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  color?: string; // pixel color, default white
  density?: number; // lower = fewer pixels (spacing)
  amplitude?: number; // vertical wave amplitude in px
};

export default function ParticleWave({
  color = "#ffffff",
  density = 14,
  amplitude = 12,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      cols = Math.ceil(width / density);
      rows = Math.ceil(height / density);
      // recompute randomness containers when size changes
      colOffsets = new Array(cols)
        .fill(0)
        .map(() => Math.random() * Math.PI * 2);
      colAmp = new Array(cols).fill(0).map(() => 0.6 + Math.random() * 0.8);
      cellJitter = Array.from({ length: cols }, () =>
        Array.from(
          { length: rows },
          () => (Math.random() - 0.5) * density * 0.4,
        ),
      );
    };

    resize();
    window.addEventListener("resize", resize);

    // prepare randomness containers
    let colOffsets = new Array(cols)
      .fill(0)
      .map(() => Math.random() * Math.PI * 2);
    let colAmp = new Array(cols).fill(0).map(() => 0.6 + Math.random() * 0.8); // per-column amplitude multiplier
    let cellJitter: number[][] = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => (Math.random() - 0.5) * density * 0.4),
    );

    const draw = (t: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // subtle fade overlay to create persistence feel
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, width, height);

      const time = t * 0.001;
      const basePixelSize = Math.max(1, Math.min(6, density / 4));
      ctx.fillStyle = color;

      for (let col = 0; col < cols; col++) {
        const x =
          col * density +
          density / 2 +
          Math.sin(time * 0.3 + col) * density * 0.08;
        // per-column phase makes waves travel horizontally
        const phase = colOffsets[col % colOffsets.length];
        const ampMult = colAmp[col % colAmp.length];
        for (let row = 0; row < rows; row++) {
          const yBase = row * density + density / 2;
          // combine multiple sine layers for more organic motion
          const layer1 = Math.sin(time * 1.1 + col * 0.22 + row * 0.11 + phase);
          const layer2 = Math.sin(
            time * 0.6 + col * 0.6 + row * 0.05 + phase * 0.7,
          );
          const layer3 = Math.sin(
            time * 1.9 + col * 0.12 - row * 0.09 + phase * 1.3,
          );
          const noise = layer1 * 0.6 + layer2 * 0.3 + layer3 * 0.1;
          const offset =
            noise * amplitude * ampMult * Math.cos(row * 0.06 + time * 0.5);
          const jitter = (cellJitter[col] && cellJitter[col][row]) || 0;
          const y = yBase + offset + jitter;
          // pixel size variation for depth
          const pixelSize =
            basePixelSize +
            Math.abs(Math.sin(time * 0.9 + col * 0.1 + row * 0.05)) * 0.9;
          // small alpha variation for softness
          const alpha =
            0.28 +
            0.7 * Math.abs(Math.sin(time * 0.8 + col * 0.2 + row * 0.05));
          ctx.globalAlpha = Math.min(1, alpha);
          ctx.fillRect(
            x - pixelSize / 2,
            y - pixelSize / 2,
            pixelSize,
            pixelSize,
          );
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [color, density, amplitude]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-10 w-full h-full"
      aria-hidden
    />
  );
}
