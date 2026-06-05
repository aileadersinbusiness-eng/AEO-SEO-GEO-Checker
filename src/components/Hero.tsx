"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import FloatingOrbs from "./FloatingOrbs";

function AINodesIllustration() {
  const nodes = [
    { cx: 250, cy: 150, r: 20, label: "ChatGPT", color: "#10B981" },
    { cx: 450, cy: 80, r: 18, label: "Claude", color: "#7C3AED" },
    { cx: 600, cy: 180, r: 16, label: "Gemini", color: "#06B6D4" },
    { cx: 150, cy: 280, r: 14, label: "Perplexity", color: "#F59E0B" },
    { cx: 400, cy: 250, r: 22, label: "Google AI", color: "#EF4444" },
    { cx: 550, cy: 320, r: 15, label: "Your Content", color: "#7C3AED" },
    { cx: 320, cy: 340, r: 12, label: "AEO", color: "#06B6D4" },
  ];

  const connections = [
    [0, 1], [1, 2], [0, 4], [2, 4], [3, 4], [4, 5], [4, 6], [3, 6], [5, 6],
  ];

  return (
    <svg viewBox="0 0 750 420" className="w-full max-w-lg" fill="none">
      <defs>
        <radialGradient id="nodeGlow0" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nodeGlow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nodeGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Connections */}
      {connections.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke={`url(#line${i})`}
          strokeWidth="1.5"
          strokeOpacity="0.3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: i * 0.1 }}
        />
      ))}

      {/* Animated data packets */}
      {connections.slice(0, 4).map(([a, b], i) => (
        <motion.circle
          key={`packet-${i}`}
          r="3"
          fill="#7C3AED"
          initial={{ x: nodes[a].cx, y: nodes[a].cy, opacity: 0 }}
          animate={{
            x: [nodes[a].cx, nodes[b].cx, nodes[a].cx],
            y: [nodes[a].cy, nodes[b].cy, nodes[a].cy],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear",
          }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
        >
          {/* Glow */}
          <circle cx={node.cx} cy={node.cy} r={node.r * 3} fill={node.color} opacity="0.08" />
          {/* Ring */}
          <motion.circle
            cx={node.cx} cy={node.cy} r={node.r + 6}
            stroke={node.color} strokeWidth="1" fill="none" opacity="0.3"
            animate={{ r: [node.r + 4, node.r + 10, node.r + 4] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
          />
          {/* Node */}
          <circle cx={node.cx} cy={node.cy} r={node.r} fill={`${node.color}22`} stroke={node.color} strokeWidth="1.5" />
          {/* Label */}
          <text x={node.cx} y={node.cy + node.r + 16} textAnchor="middle" fill={node.color} fontSize="10" fontWeight="600" opacity="0.9">
            {node.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="features" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <FloatingOrbs />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div ref={ref} className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 border border-primary/20"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-slate-300">AI Search Optimization Engine</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-tight text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight"
            >
              Will AI Search{" "}
              <span className="gradient-text">Recommend</span>{" "}
              Your Content?
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed max-w-xl"
            >
              Analyze blogs, LinkedIn articles and website content for AI visibility, answer engine optimization, and citation potential across{" "}
              <span className="text-secondary">Google AI Mode</span>,{" "}
              <span className="text-primary">ChatGPT</span>,{" "}
              <span className="text-accent">Claude</span>,{" "}
              <span className="text-success">Perplexity</span>, and{" "}
              <span className="text-danger">Gemini</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("analyze")}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all"
              >
                Analyze Content <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo("analyze")}
                className="flex items-center justify-center gap-2 glass border border-white/10 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all hover:border-primary/30"
              >
                <Play size={16} className="text-secondary" /> See Sample Analysis
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8 pt-4"
            >
              {[
                { label: "AI Platforms Covered", value: "5+" },
                { label: "AEO Dimensions Scored", value: "7" },
                { label: "Content Types Supported", value: "All" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-tight text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: SVG Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <AINodesIllustration />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
