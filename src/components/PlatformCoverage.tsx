"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const platforms = [
  {
    name: "Google AI Mode",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
    color: "#4285F4",
    desc: "AI Overviews",
  },
  {
    name: "ChatGPT",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
        <circle cx="12" cy="12" r="11" fill="#10A37F" />
        <path fill="white" d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zm0 13.5a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" opacity="0.3"/>
        <path fill="white" d="M15.5 10.5c0-1.93-1.57-3.5-3.5-3.5S8.5 8.57 8.5 10.5c0 1.5.94 2.79 2.27 3.3v1.7h2.46v-1.7c1.33-.51 2.27-1.8 2.27-3.3z"/>
      </svg>
    ),
    color: "#10A37F",
    desc: "OpenAI Search",
  },
  {
    name: "Claude",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
        <rect width="24" height="24" rx="6" fill="#CC785C" />
        <path fill="white" d="M12 4L7 14h2.5L12 8l2.5 6H17L12 4z" />
        <path fill="white" opacity="0.7" d="M9 16h6v2H9z" />
      </svg>
    ),
    color: "#CC785C",
    desc: "Anthropic AI",
  },
  {
    name: "Perplexity",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
        <rect width="24" height="24" rx="6" fill="#20808D" />
        <path fill="white" d="M12 4v6l-5 3 5 3v4l5-3-5-3V4z" opacity="0.9"/>
        <path fill="white" opacity="0.4" d="M17 7l-5 3v7" strokeWidth="0"/>
      </svg>
    ),
    color: "#20808D",
    desc: "AI Answer Engine",
  },
  {
    name: "Gemini",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
        <defs>
          <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4"/>
            <stop offset="50%" stopColor="#9B59B6"/>
            <stop offset="100%" stopColor="#EA4335"/>
          </linearGradient>
        </defs>
        <path fill="url(#gemGrad)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <path fill="url(#gemGrad)" d="M12 6l-1.5 5.5H5l4.5 3.5-1.5 5L12 17l4 3-1.5-5 4.5-3.5h-5.5z" opacity="0.8"/>
      </svg>
    ),
    color: "#4285F4",
    desc: "Google DeepMind",
  },
  {
    name: "Google AI Overviews",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
        <rect width="24" height="24" rx="6" fill="#1A73E8" />
        <path fill="white" d="M12 5L5 12l7 7 7-7-7-7zm0 2.8L16.2 12 12 16.2 7.8 12 12 7.8z"/>
      </svg>
    ),
    color: "#1A73E8",
    desc: "Zero-Click Answers",
  },
];

export default function PlatformCoverage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const doubled = [...platforms, ...platforms];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-tight text-3xl lg:text-4xl font-bold mb-4">
            Optimized for Every{" "}
            <span className="gradient-text">AI Answer Engine</span>
          </h2>
          <p className="text-slate-400">
            Get your content seen and cited across all major AI platforms
          </p>
        </motion.div>

        {/* Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="marquee-container">
            <div className="marquee-track gap-6 py-4">
              {doubled.map((platform, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="inline-flex items-center gap-4 glass rounded-xl px-6 py-4 border border-white/8 mr-6 flex-shrink-0 min-w-[200px] cursor-default"
                >
                  <div className="flex-shrink-0">{platform.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-white">{platform.name}</div>
                    <div className="text-xs text-slate-500">{platform.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
