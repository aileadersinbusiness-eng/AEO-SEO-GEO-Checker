'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, useMotionValueEvent } from 'framer-motion';

/* ─── Trail layers (innermost → outermost) ─── */
const TRAIL_LAYERS = [
  { trailLen: 60,  opacity: 0.82, width: 1.5, color: '218, 200, 160' }, // sharp tip
  { trailLen: 110, opacity: 0.46, width: 2.6, color: '205, 188, 150' }, // mid
  { trailLen: 170, opacity: 0.20, width: 4.2, color: '192, 175, 138' }, // soft halo
  { trailLen: 230, opacity: 0.07, width: 7.0, color: '178, 162, 126' }, // outer glow
] as const;

/* ─── Pencil geometry (tip at local origin 0,0, body extends downward) ─── */
const PW  = 12;  // body width
const PBH = 60;  // body height
const TCH = 15;  // wood cone height
const TGL = 7;   // graphite tip length
const ERH = 8;   // eraser height

function PencilIcon() {
  const bodyTop = TGL + TCH;
  const bodyBot = bodyTop + PBH;
  return (
    <g transform={`translate(${-PW / 2}, 0)`}>
      {/* Graphite tip */}
      <polygon points={`${PW * 0.28},${TGL} ${PW * 0.72},${TGL} ${PW / 2},0`} fill="#2e2e2e" />
      {/* Wood cone */}
      <polygon
        points={`0,${TCH + TGL} ${PW},${TCH + TGL} ${PW * 0.72},${TGL} ${PW * 0.28},${TGL}`}
        fill="#c07a50"
      />
      <polygon
        points={`1,${TCH + TGL} ${PW * 0.34},${TCH + TGL} ${PW * 0.31},${TGL + 1}`}
        fill="rgba(255,255,255,0.16)"
      />
      {/* Body */}
      <rect x={0} y={bodyTop} width={PW} height={PBH} fill="#eebc38" rx="1" />
      {/* Left shadow */}
      <rect x={0} y={bodyTop} width={1.4} height={PBH} fill="rgba(0,0,0,0.14)" />
      {/* Right shadow */}
      <rect x={PW - 1.4} y={bodyTop} width={1.4} height={PBH} fill="rgba(0,0,0,0.20)" />
      {/* Highlight streak */}
      <rect x={2.2} y={bodyTop} width={2.8} height={PBH} fill="rgba(255,255,255,0.24)" rx="1" />
      {/* Grain lines */}
      {[0.28, 0.55, 0.78].map((t) => (
        <line key={t} x1={0} y1={bodyTop + PBH * t} x2={PW} y2={bodyTop + PBH * t}
          stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
      ))}
      {/* Ferrule */}
      <rect x={0} y={bodyBot} width={PW} height={4} fill="#9aa3ae" />
      <rect x={0} y={bodyBot + 1} width={PW} height={1} fill="rgba(255,255,255,0.28)" />
      {/* Eraser */}
      <rect x={1} y={bodyBot + 4} width={PW - 2} height={ERH} fill="#f0a0b5" rx="1.5" />
      <rect x={2.5} y={bodyBot + 4} width={2.2} height={ERH} fill="rgba(255,255,255,0.24)" rx="1" />
    </g>
  );
}

/* ─── Build the weaving path (proportional to document height) ─── */
function buildPath(h: number): string {
  const L  = 82;   // left margin x
  const R  = 1358; // right margin x
  const MX = 720;  // centre x

  const pts: [number, number][] = [
    [MX,      0        ],
    [L + 28,  h * 0.06 ],
    [L,       h * 0.13 ],
    [L + 55,  h * 0.20 ],
    [MX - 35, h * 0.27 ],
    [R - 28,  h * 0.33 ],
    [R,       h * 0.39 ],
    [R - 45,  h * 0.45 ],
    [MX + 18, h * 0.52 ],
    [L + 38,  h * 0.57 ],
    [L,       h * 0.63 ],
    [L + 28,  h * 0.69 ],
    [MX - 18, h * 0.75 ],
    [R - 18,  h * 0.80 ],
    [R,       h * 0.85 ],
    [R - 55,  h * 0.90 ],
    [MX,      h * 0.94 ],
    // Sweep right and down to point at "Powered by Business With AI Strategist"
    // which sits in the footer's right column (~x=1100, near bottom of page)
    [1050,    h * 0.975],
    [1130,    h - 30   ],  // final point: pencil tip lands on the branding text
  ];

  const T = 0.38; // curve tension
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const next = pts[Math.min(i + 1, pts.length - 1)];
    const cpx1 = prev[0] + (curr[0] - (i > 1 ? pts[i - 2][0] : prev[0])) * T;
    const cpy1 = prev[1] + (curr[1] - (i > 1 ? pts[i - 2][1] : prev[1])) * T;
    const cpx2 = curr[0] - (next[0] - prev[0]) * T;
    const cpy2 = curr[1] - (next[1] - prev[1]) * T;
    d += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${curr[0]},${curr[1]}`;
  }
  return d;
}

/* ─── Component ─── */
export default function PencilDrawing() {
  const masterPathRef = useRef<SVGPathElement>(null);        // geometry-only path (invisible)
  const layerRefs     = useRef<(SVGPathElement | null)[]>([]); // one per TRAIL_LAYERS
  const pencilRef     = useRef<SVGGElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [docHeight,  setDocHeight]  = useState(6000);
  const [pathD,      setPathD]      = useState('');
  const [mounted,    setMounted]    = useState(false);

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 20, mass: 0.55 });

  /* ── Per-frame: move pencil + update every trail layer ── */
  useMotionValueEvent(smooth, 'change', (progress) => {
    const masterPath = masterPathRef.current;
    const pencilG    = pencilRef.current;
    if (!masterPath || !pencilG || pathLength === 0) return;

    const currentLen = progress * pathLength;

    /* ── Pencil position & rotation ── */
    const pt    = masterPath.getPointAtLength(currentLen);
    const ahead = masterPath.getPointAtLength(Math.min(currentLen + 6, pathLength));
    const angle = Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * (180 / Math.PI);
    pencilG.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${angle + 90 + 33})`);

    /* ── Trail layers: sliding dasharray window ── */
    layerRefs.current.forEach((el, i) => {
      if (!el) return;
      const { trailLen } = TRAIL_LAYERS[i];
      // Window: from max(0, currentLen - trailLen)  →  currentLen
      const startPos   = Math.max(0, currentLen - trailLen);
      const visibleLen = currentLen - startPos; // builds up from 0, caps at trailLen
      if (visibleLen <= 0) {
        el.setAttribute('stroke-dasharray', '0 99999');
        return;
      }
      // dashoffset = -startPos shifts the dash window to start at startPos
      el.setAttribute('stroke-dasharray', `${visibleLen} ${pathLength + trailLen}`);
      el.setAttribute('stroke-dashoffset', String(-startPos));
    });
  });

  /* ── Measure document height & build path on mount / resize ── */
  useEffect(() => {
    setMounted(true);
    const update = () => {
      const h = document.body.scrollHeight;
      setDocHeight(h);
      setPathD(buildPath(h));
    };
    update();
    window.addEventListener('resize', update);
    const t = setTimeout(update, 800);
    return () => { window.removeEventListener('resize', update); clearTimeout(t); };
  }, []);

  /* ── Measure total path length once path renders ── */
  useEffect(() => {
    if (masterPathRef.current && pathD) {
      setPathLength(masterPathRef.current.getTotalLength());
    }
  }, [pathD]);

  if (!mounted || !pathD) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10, top: 0, left: 0, width: '100%', height: docHeight }}
    >
      <svg
        width="100%"
        height={docHeight}
        viewBox={`0 0 1440 ${docHeight}`}
        preserveAspectRatio="xMidYMin meet"
        className="absolute top-0 left-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Organic pencil-texture displacement */}
          <filter id="sketch-tex" x="-4%" y="-1%" width="108%" height="102%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.09"
              numOctaves="3" seed="12" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise"
              scale="2.4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* Soft glow on the pencil */}
          <filter id="pencil-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Invisible geometry path — used only for getPointAtLength */}
        <path ref={masterPathRef} d={pathD} fill="none" stroke="none" />

        {/* Trail layers — outermost first so inner layers paint on top */}
        {[...TRAIL_LAYERS].reverse().map((layer, ri) => {
          const i = TRAIL_LAYERS.length - 1 - ri; // real index
          return (
            <path
              key={i}
              ref={(el) => { layerRefs.current[i] = el; }}
              d={pathD}
              fill="none"
              stroke={`rgba(${layer.color}, ${layer.opacity})`}
              strokeWidth={layer.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#sketch-tex)"
              strokeDasharray="0 99999"
              style={{ willChange: 'stroke-dasharray, stroke-dashoffset' }}
            />
          );
        })}

        {/* Pencil */}
        <g ref={pencilRef} style={{ willChange: 'transform' }}>
          <PencilIcon />
          {/* Tip glint */}
          <circle r="2" cx="0" cy="0" fill="rgba(255, 240, 180, 0.6)"
            filter="url(#pencil-glow)" />
        </g>
      </svg>
    </div>
  );
}
