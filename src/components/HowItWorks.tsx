"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardPaste, BarChart3, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: ClipboardPaste,
    title: "Paste Content",
    description: "Drop in your blog post, LinkedIn article, or webpage content. We support plain text and markdown formats.",
    number: "01",
    color: "from-primary to-purple-500",
    glow: "rgba(124,58,237,0.2)",
  },
  {
    icon: BarChart3,
    title: "Analyze AEO Visibility",
    description: "Our AI engine scores your content across 7 key AEO dimensions including answerability, entity coverage, and citation potential.",
    number: "02",
    color: "from-secondary to-cyan-400",
    glow: "rgba(6,182,212,0.2)",
  },
  {
    icon: TrendingUp,
    title: "Improve Performance",
    description: "Get actionable recommendations to rank in AI-powered answer engines like Google AI Mode, ChatGPT, and Perplexity.",
    number: "03",
    color: "from-accent to-yellow-400",
    glow: "rgba(245,158,11,0.2)",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 border border-white/10 mb-6">
            <span className="text-xs font-medium text-slate-400">Simple 3-Step Process</span>
          </div>
          <h2 className="font-tight text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From raw content to AI-optimized insights in under 30 seconds.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent origin-left"
              style={{ opacity: 0.3 }}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 relative">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: `0 0 40px ${step.glow}`,
                  }}
                  className="glass rounded-2xl p-8 border border-white/8 relative overflow-hidden group cursor-default"
                >
                  {/* Background shimmer on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5`} />
                  </div>

                  {/* Step number */}
                  <div className="absolute top-6 right-6 font-tight text-5xl font-bold text-white/5 select-none">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 relative`}>
                    <Icon size={24} className="text-white" />
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.color} blur-lg opacity-50`} />
                  </div>

                  {/* Content */}
                  <h3 className="font-tight text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>

                  {/* Bottom accent line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${step.color}`}
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
