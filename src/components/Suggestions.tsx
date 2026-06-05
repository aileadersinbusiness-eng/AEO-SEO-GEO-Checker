"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";

interface Props {
  suggestions: string[];
}

export default function Suggestions({ suggestions }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 border border-white/8"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
          <Sparkles size={16} className="text-primary" />
        </div>
        <div>
          <h3 className="font-tight font-bold text-white text-base">Optimization Suggestions</h3>
          <p className="text-xs text-slate-500">Actionable steps to improve your AEO score</p>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/25 hover:bg-primary/8 transition-all group"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
              <span className="text-primary text-xs font-bold">{i + 1}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed flex-1">{suggestion}</p>
            <ChevronRight size={14} className="text-slate-600 group-hover:text-primary transition-colors mt-0.5 flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
