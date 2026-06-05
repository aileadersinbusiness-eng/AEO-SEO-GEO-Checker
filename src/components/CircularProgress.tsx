"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface Props {
  score: number;
  size?: number;
}

function getColor(score: number) {
  if (score >= 70) return "#10B981";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

function getLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 40) return "Poor";
  return "Critical";
}

export default function CircularProgress({ score, size = 180 }: Props) {
  const count = useMotionValue(0);
  const displayScore = useTransform(count, (v) => Math.round(v));
  const color = getColor(score);
  const label = getLabel(score);

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circumference;

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [score, count]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"
          />
          {/* Progress ring */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${strokeDash} ${circumference}` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="font-tight text-4xl font-bold"
            style={{ color }}
          >
            <motion.span>{displayScore}</motion.span>
          </motion.div>
          <div className="text-xs text-slate-500 mt-1">/ 100</div>
        </div>

        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-20"
          style={{ background: color }}
        />
      </div>

      <div className="text-center">
        <div className="font-tight font-bold text-white text-sm">AEO Visibility Score</div>
        <div className="text-xs font-semibold mt-1" style={{ color }}>{label}</div>
      </div>
    </div>
  );
}
