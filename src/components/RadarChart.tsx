"use client";

import {
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { AnalysisScores } from "@/lib/types";

interface Props {
  scores: AnalysisScores;
}

export default function RadarChart({ scores }: Props) {
  const data = [
    { dimension: "Answerability", value: scores.answerability, fullMark: 100 },
    { dimension: "Entities", value: scores.entityCoverage, fullMark: 100 },
    { dimension: "Questions", value: scores.questionCoverage, fullMark: 100 },
    { dimension: "Citations", value: scores.citationPotential, fullMark: 100 },
    { dimension: "Structure", value: scores.structureQuality, fullMark: 100 },
    { dimension: "Extractability", value: scores.aiExtractability, fullMark: 100 },
    { dimension: "Trust", value: scores.trustSignals, fullMark: 100 },
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { dimension: string; value: number } }> }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="glass rounded-lg px-3 py-2 border border-white/10 text-xs">
          <div className="font-semibold text-white">{d.dimension}</div>
          <div className="text-primary font-bold">{d.value}/100</div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 border border-white/8"
    >
      <h3 className="font-tight font-bold text-white text-base mb-4">Dimension Radar</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ReRadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#7C3AED"
            fill="#7C3AED"
            fillOpacity={0.15}
            strokeWidth={2}
            animationDuration={1000}
            animationEasing="ease-out"
          />
          <Radar
            name="Max"
            dataKey="fullMark"
            stroke="rgba(124,58,237,0.1)"
            fill="none"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <Tooltip content={<CustomTooltip />} />
        </ReRadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
