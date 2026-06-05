'use client';

import { useEffect, useRef, useState } from 'react';
import {
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import { motion } from 'framer-motion';

/* ─── Pencil geometry (local coords, tip at 0,0) ─── */
const PW = 13;   // body width
const PBH = 64;  // body height
const TCH = 16;  // cone height
const TGL = 6;   // graphite tip length
const ERH = 9;   // eraser height

// The pencil is drawn tip-up so tip = local (PW/2, 0).
// We translate by (-PW/2, 0) so tip is at local origin.
function PencilIcon() {
  const x0 = 0;
  const bodyTop = TGL + TCH;   // body starts here (y downward)
  const bodyBot = bodyTop + PBH;

  return (
    <g transform={`translate(${-PW / 2}, 0)`} style={{ willChange: 'transform' }}>
      {/* Graphite tip */}
      <polygon
        points={`${PW * 0.25},${TGL} ${PW * 0.75},${TGL} ${PW / 2},0`}
        fill="#3a3a3a"
      />
      {/* Wood cone */}
      <polygon
        points={`0,${TCH + TGL} ${PW},${TCH + TGL} ${PW * 0.75},${TGL} ${PW * 0.25},${TGL}`}
        fill="#c8845a"
      />
      {/* Cone shine */}
      <polygon
        points={`1,${TCH + TGL} ${PW * 0.35},${TCH + TGL} ${PW * 0.3},${TGL + 1}`}
        fill="rgba(255,255,255,0.18)"
      />
      {/* Body */}
      <rect x={x0} y={bodyTop} width={PW} height={PBH} fill="#f0c040" rx="1" />
      {/* Body left edge shadow */}
      <rect x={x0} y={bodyTop} width={1.5} height={PBH} fill="rgba(0,0,0,0.15)" />
      {/* Body right edge shadow */}
      <rect x={PW - 1.5} y={bodyTop} width={1.5} height={PBH} fill="rgba(0,0,0,0.2)" />
      {/* Body highlight */}
      <rect x={x0 + 2.5} y={bodyTop} width={3} height={PBH} fill="rgba(255,255,255,0.22)" rx="1" />
      {/* Body grain lines — subtle */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={x0}
          y1={bodyTop + PBH * t}
          x2={PW}
          y2={bodyTop + PBH * t}
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="0.5"
        />
      ))}
      {/* Metal ferrule band */}
      <rect x={x0} y={bodyBot} width={PW} height={4} fill="#a0a8b0" />
      <rect x={x0} y={bodyBot + 1} width={PW} height={1} fill="rgba(255,255,255,0.3)" />
      {/* Eraser */}
      <rect x={x0 + 1} y={bodyBot + 4} width={PW - 2} height={ERH} fill="#f4a8b8" rx="1.5" />
      {/* Eraser highlight */}
      <rect x={x0 + 2.5} y={bodyBot + 4} width={2.5} height={ERH} fill="rgba(255,255,255,0.25)" rx="1" />
    </g>
  );
}

/* ─── Build the weaving path ─── */
function buildPath(h: number): string {
  // Weave left ↔ right through the page margins.
  // At 1440px wide, content lives in a ~1280px centre column,
  // so margins at ~80px (left) and ~1360px (right) are safe.
  const L = 80;   // left anchor x
  const R = 1360; // right anchor x
  const MX = 720; // mid crossing x

  // Y-positions for each "anchor" (approximate section boundaries)
  const pts = [
    [MX,       0],           // start – top centre
    [L + 30,   h * 0.06],    // hero left
    [L,        h * 0.13],
    [L + 60,   h * 0.20],    // hero lower
    [MX - 40,  h * 0.27],    // crossing towards right (HowItWorks)
    [R - 30,   h * 0.33],
    [R,        h * 0.39],
    [R - 50,   h * 0.45],    // platform coverage, right
    [MX + 20,  h * 0.52],    // crossing back left
    [L + 40,   h * 0.57],    // analyzer left
    [L,        h * 0.63],
    [L + 30,   h * 0.69],
    [MX - 20,  h * 0.75],    // crossing to results right
    [R - 20,   h * 0.80],
    [R,        h * 0.85],
    [R - 60,   h * 0.90],
    [MX,       h * 0.95],    // sweep back to centre for footer
    [MX,       h],
  ];

  // Build smooth cubic bezier through points
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const next = pts[Math.min(i + 1, pts.length - 1)];
    // Control points: tension = 0.4
    const t = 0.4;
    const cpx1 = prev[0] + (curr[0] - (i > 1 ? pts[i - 2][0] : prev[0])) * t;
    const cpy1 = prev[1] + (curr[1] - (i > 1 ? pts[i - 2][1] : prev[1])) * t;
    const cpx2 = curr[0] - (next[0] - prev[0]) * t;
    const cpy2 = curr[1] - (next[1] - prev[1]) * t;
    d += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${curr[0]},${curr[1]}`;
  }
  return d;
}

/* ─── Main component ─── */
export default function PencilDrawing() {
  const pathRef       = useRef<SVGPathElement>(null);
  const pencilGRef    = useRef<SVGGElement>(null);
  const [pathLength,  setPathLength]  = useState(0);
  const [docHeight,   setDocHeight]   = useState(6000);
  const [pathD,       setPathD]       = useState('');
  const [mounted,     setMounted]     = useState(false);

  // Window scroll progress 0→1
  const { scrollYProgress } = useScroll();
  // Smooth with spring – stiffness/damping control "lag" feel
  const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 18, mass: 0.6 });

  // Derive strokeDashoffset from smooth progress
  const dashOffset = useTransform(smooth, [0, 1], [pathLength, 0]);

  // On every spring tick, move pencil along path via direct DOM mutation
  useMotionValueEvent(smooth, 'change', (progress) => {
    const path = pathRef.current;
    const g    = pencilGRef.current;
    if (!path || !g || pathLength === 0) return;

    const len    = progress * pathLength;
    const point  = path.getPointAtLength(len);
    const ahead  = path.getPointAtLength(Math.min(len + 8, pathLength));

    // Angle of travel (radians → degrees)
    const angle  = Math.atan2(ahead.y - point.y, ahead.x - point.x) * (180 / Math.PI);

    // The pencil SVG is drawn tip-at-origin pointing "up" (−90°),
    // so we add 90° to align tip with travel direction, then tilt 35° (natural hold).
    const tilt   = angle + 90 + 35;

    g.setAttribute(
      'transform',
      `translate(${point.x}, ${point.y}) rotate(${tilt})`
    );
  });

  // Measure doc height & rebuild path when layout settles
  useEffect(() => {
    setMounted(true);
    const update = () => {
      const h = document.body.scrollHeight;
      setDocHeight(h);
      setPathD(buildPath(h));
    };
    update();
    // Recheck after fonts/images load
    window.addEventListener('resize', update);
    const t = setTimeout(update, 600);
    return () => { window.removeEventListener('resize', update); clearTimeout(t); };
  }, []);

  // Measure path length after path renders
  useEffect(() => {
    if (pathRef.current && pathD) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [pathD]);

  if (!mounted || !pathD) return null;

  const VW = 1440;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10, top: 0, left: 0, width: '100%', height: docHeight }}
    >
      <svg
        width="100%"
        height={docHeight}
        viewBox={`0 0 ${VW} ${docHeight}`}
        preserveAspectRatio="xMidYMin meet"
        className="absolute top-0 left-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Sketch / organic texture filter */}
          <filter id="pencil-sketch" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025 0.08"
              numOctaves="3"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.8"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.4" result="blur" />
            <feBlend in="blur" in2="SourceGraphic" mode="normal" result="blend" />
          </filter>

          {/* Subtle glow along the stroke */}
          <filter id="pencil-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost guide line — ultra-faint, shows full intended path */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.025)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* The drawn stroke — revealed progressively */}
        <motion.path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="rgba(210, 195, 160, 0.52)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#pencil-sketch)"
          style={{
            strokeDasharray: pathLength || 99999,
            strokeDashoffset: dashOffset,
            willChange: 'stroke-dashoffset',
          }}
        />

        {/* Second pass — slightly offset, lower opacity for double-stroke sketch feel */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="rgba(180, 165, 130, 0.22)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#pencil-sketch)"
          style={{
            strokeDasharray: pathLength || 99999,
            strokeDashoffset: dashOffset,
            willChange: 'stroke-dashoffset',
          }}
        />

        {/* Pencil icon — positioned by useMotionValueEvent above */}
        <g ref={pencilGRef} style={{ willChange: 'transform' }}>
          <PencilIcon />
          {/* Tiny glow dot at tip */}
          <circle r="2.5" cx="0" cy="0" fill="rgba(245, 220, 140, 0.7)" filter="url(#pencil-glow)" />
        </g>
      </svg>
    </div>
  );
}
