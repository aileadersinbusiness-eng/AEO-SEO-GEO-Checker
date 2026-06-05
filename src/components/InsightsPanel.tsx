"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, XCircle, Lightbulb, Zap } from "lucide-react";
import { AnalysisInsights } from "@/lib/types";

interface Props {
  insights: AnalysisInsights;
}

const tabs = [
  { key: "strengths" as const, label: "Strengths", icon: CheckCircle2, color: "text-success", bg: "bg-success/10", border: "border-success/20", activeBg: "bg-success/15" },
  { key: "weaknesses" as const, label: "Weaknesses", icon: XCircle, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20", activeBg: "bg-danger/15" },
  { key: "missedOpportunities" as const, label: "Missed", icon: Lightbulb, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", activeBg: "bg-accent/15" },
  { key: "quickWins" as const, label: "Quick Wins", icon: Zap, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20", activeBg: "bg-secondary/15" },
];

export default function InsightsPanel({ insights }: Props) {
  const [activeTab, setActiveTab] = useState<keyof AnalysisInsights>("strengths");
  const activeConfig = tabs.find(t => t.key === activeTab)!;
  const ActiveIcon = activeConfig.icon;
  const items = insights[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 border border-white/8"
    >
      <h3 className="font-tight font-bold text-white text-base mb-4">AI Insights</h3>

      {/* Tab bar */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? `${tab.activeBg} ${tab.border} ${tab.color}`
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-3"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-lg ${activeConfig.bg} border ${activeConfig.border}`}
            >
              <ActiveIcon size={15} className={`${activeConfig.color} mt-0.5 flex-shrink-0`} />
              <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
