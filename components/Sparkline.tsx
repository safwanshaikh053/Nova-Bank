"use client";

import { motion } from "framer-motion";

function buildPath(points: number[], width: number, height: number) {
  if (points.length === 0) return { line: "", area: "" };
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = width / (points.length - 1 || 1);

  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = height - ((p - min) / range) * height;
    return [x, y];
  });

  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  const area = `${line} L ${width} ${height} L 0 ${height} Z`;

  return { line, area };
}

export default function Sparkline({
  data,
  width = 480,
  height = 140,
  accent = "#4CD9C0",
}: {
  data: number[];
  width?: number;
  height?: number;
  accent?: string;
}) {
  const { line, area } = buildPath(data, width, height);
  const gradientId = "sparkline-gradient";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={accent}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
