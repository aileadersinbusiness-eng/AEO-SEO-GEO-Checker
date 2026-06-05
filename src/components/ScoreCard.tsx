"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Props {
  name: string;
  score: number;
  description: string;
  detail: string;
  icon: LucideIcon;
  index: number;
}

function getBarColor(score: number) {
  if (score >= 70) return "from-success to-emerald-400";
  if (score >= 40) return "from-accent to-yellow-400";
  return "from-danger to-red-400";
}

function getScoreColor(score: number) {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-accent";
  return "text-danger";
}

export default function ScoreCard({ name, score, description, detail, icon: Icon, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const barColor = getBarColor(score);
  const scoreColor = getScoreColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ scale: 1.01 }}
      className="glass rounded-xl border border-white/8 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/3 transition-colors"
      >
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          score >= 70 ? "bg-success/15" : score >= 40 ? "bg-accent/15" : "bg-danger/15"
        }`}>
          <Icon size={18} className={scoreColor} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-white text-sm">{name}</span>
            <span className={`font-tight font-bold text-base ${scoreColor}`}>{score}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.07, ease: "easeOut" }}
            />
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 pt-2 border-t border-white/5">
          <p className="text-slate-400 text-xs leading-relaxed mb-2">{description}</p>
          <p className="text-slate-500 text-xs leading-relaxed">{detail}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
