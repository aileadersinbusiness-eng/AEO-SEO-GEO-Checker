"use client";

import { motion } from "framer-motion";
import { HelpCircle, AlertTriangle } from "lucide-react";

interface Props {
  gaps: string[];
}

export default function QuestionGaps({ gaps }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 border border-white/8"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
          <AlertTriangle size={16} className="text-accent" />
        </div>
        <div>
          <h3 className="font-tight font-bold text-white text-base">Question Gap Analysis</h3>
          <p className="text-xs text-slate-500">Questions your content doesn&apos;t answer</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {gaps.map((gap, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10 hover:border-accent/20 transition-colors"
          >
            <HelpCircle size={15} className="text-accent/70 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300 text-sm">{gap}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-white/3 border border-white/5">
        <p className="text-xs text-slate-500">
          <span className="text-accent font-semibold">Tip:</span> Answering these questions in your content can significantly increase the number of AI queries where your content gets cited.
        </p>
      </div>
    </motion.div>
  );
}
