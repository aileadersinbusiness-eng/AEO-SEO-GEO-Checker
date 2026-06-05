"use client";

import { motion } from "framer-motion";
import { MessageSquare, Network, HelpCircle, BookOpen, Layout, Bot, Shield } from "lucide-react";
import { AnalysisResult } from "@/lib/types";
import CircularProgress from "./CircularProgress";
import ScoreCard from "./ScoreCard";
import RadarChart from "./RadarChart";
import InsightsPanel from "./InsightsPanel";
import QuestionGaps from "./QuestionGaps";
import Suggestions from "./Suggestions";
import RewriteModule from "./RewriteModule";

interface Props {
  result: AnalysisResult;
  originalContent: string;
}

const scoreCards = [
  {
    key: "answerability" as const,
    name: "Answerability",
    icon: MessageSquare,
    description: "Can AI easily extract direct answers from your content?",
    detail: "Measures the presence of clear definitions, subject-verb-object patterns, and direct answer statements. High answerability means AI can quickly extract precise answers.",
  },
  {
    key: "entityCoverage" as const,
    name: "Entity Coverage",
    icon: Network,
    description: "Named people, brands, tools, and concepts referenced",
    detail: "AI systems build knowledge graphs around entities. More specific named entities (brands, products, people, tools) increase the likelihood your content is cited in entity-related queries.",
  },
  {
    key: "questionCoverage" as const,
    name: "Question Coverage",
    icon: HelpCircle,
    description: "User questions explicitly answered",
    detail: "Measures how many user questions your content directly addresses through question-format headings, FAQ sections, and structured Q&A content.",
  },
  {
    key: "citationPotential" as const,
    name: "Citation Potential",
    icon: BookOpen,
    description: "Would AI reference this as an authoritative source?",
    detail: "Based on presence of statistics, percentages, research citations, expert quotes, and specific data points. AI systems strongly prefer citing data-backed content.",
  },
  {
    key: "structureQuality" as const,
    name: "Structure Quality",
    icon: Layout,
    description: "Headings, lists, formatting, and visual hierarchy",
    detail: "Well-structured content with proper heading hierarchies (H1→H2→H3), bullet points, numbered lists, and bold text is significantly easier for AI to parse and extract.",
  },
  {
    key: "aiExtractability" as const,
    name: "AI Extractability",
    icon: Bot,
    description: "How easily can LLMs summarize your content?",
    detail: "Based on average sentence length, paragraph structure, and presence of clear topic sentences. Shorter, clearer sentences dramatically improve LLM summarizability.",
  },
  {
    key: "trustSignals" as const,
    name: "Trust Signals",
    icon: Shield,
    description: "Sources, evidence, dates, and verifiable information",
    detail: "Includes external links, source attribution, publication dates, author bylines, and research citations. AI systems are trained to prefer content with verifiable provenance.",
  },
];

export default function Results({ result, originalContent }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 mt-8"
    >
      {/* Overall Score */}
      <div className="glass rounded-2xl p-8 border border-white/8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <CircularProgress score={result.overallScore} size={180} />
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-tight text-2xl font-bold text-white mb-2">Your AEO Analysis is Ready</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {result.overallScore >= 70
                  ? "Strong AEO visibility! Your content is well-positioned to be cited by AI answer engines. Review the suggestions below for further improvements."
                  : result.overallScore >= 40
                  ? "Moderate AEO visibility. Your content has some good foundations but needs targeted improvements to maximize AI citation potential."
                  : "Low AEO visibility. Your content needs significant optimization before AI engines will regularly cite or recommend it."}
              </p>
            </div>

            {/* Score breakdown mini */}
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(result.scores).slice(0, 4).map(([key, val]) => (
                <div key={key} className="text-center p-2 rounded-lg bg-white/3 border border-white/5">
                  <div className={`font-tight font-bold text-lg ${val >= 70 ? "text-success" : val >= 40 ? "text-accent" : "text-danger"}`}>{val}</div>
                  <div className="text-slate-600 text-xs capitalize">{key.replace(/([A-Z])/g, " $1").split(" ")[0]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div>
        <h3 className="font-tight font-bold text-white text-lg mb-4">Dimension Scores</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {scoreCards.map((card, i) => (
            <ScoreCard
              key={card.key}
              name={card.name}
              score={result.scores[card.key]}
              description={card.description}
              detail={card.detail}
              icon={card.icon}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Radar + Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RadarChart scores={result.scores} />
        <InsightsPanel insights={result.insights} />
      </div>

      {/* Question Gaps */}
      <QuestionGaps gaps={result.questionGaps} />

      {/* Suggestions */}
      <Suggestions suggestions={result.suggestions} />

      {/* Rewrite Module */}
      <RewriteModule original={originalContent} optimized={result.optimizedVersion} />
    </motion.div>
  );
}
