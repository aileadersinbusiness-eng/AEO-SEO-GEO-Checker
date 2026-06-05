"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Wand2, Eye, Copy, Check } from "lucide-react";

interface Props {
  original: string;
  optimized: string;
}

export default function RewriteModule({ original, optimized }: Props) {
  const [showRewrite, setShowRewrite] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const originalSnippet = original.substring(0, 400) + (original.length > 400 ? "..." : "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 border border-white/8"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center">
            <Wand2 size={16} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-tight font-bold text-white text-base">AEO Rewrite Module</h3>
            <p className="text-xs text-slate-500">AI-optimized version of your content</p>
          </div>
        </div>

        {!showRewrite ? (
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowRewrite(true)}
            className="flex items-center gap-2 bg-secondary/15 border border-secondary/30 text-secondary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary/25 transition-all"
          >
            <Wand2 size={14} />
            Generate AEO-Optimized Version
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 glass border border-white/10 text-slate-300 px-3 py-2 rounded-lg text-xs font-medium hover:text-white transition-colors"
            >
              {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {!showRewrite ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-10 border border-dashed border-white/10 rounded-xl"
          >
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                <Eye size={20} className="text-secondary/50" />
              </div>
              <p className="text-slate-500 text-sm">Click the button above to generate an AEO-optimized version</p>
              <p className="text-slate-600 text-xs">Shows side-by-side comparison with improvements highlighted</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="diff"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-danger" />
                  <span className="text-xs font-semibold text-slate-400">ORIGINAL</span>
                </div>
                <div className="bg-danger/5 border border-danger/10 rounded-xl p-4 h-80 overflow-y-auto">
                  <p className="text-slate-400 text-xs leading-relaxed font-mono whitespace-pre-wrap">
                    {originalSnippet}
                  </p>
                </div>
              </div>

              {/* Optimized */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs font-semibold text-slate-400">AEO OPTIMIZED</span>
                </div>
                <div className="bg-success/5 border border-success/10 rounded-xl p-4 h-80 overflow-y-auto">
                  {optimized.split("\n").map((line, i) => {
                    const isHeading = line.startsWith("#");
                    const isBullet = line.startsWith("-") || line.startsWith("*");
                    const isBold = line.includes("**");
                    const isAdded = isHeading || isBullet || isBold || line.includes("According to") || line.includes("[");
                    return (
                      <div
                        key={i}
                        className={`text-xs leading-relaxed mb-1 font-mono ${
                          isAdded
                            ? "text-success/90 bg-success/10 rounded px-1"
                            : "text-slate-400"
                        } ${isHeading ? "font-bold" : ""}`}
                      >
                        {line || " "}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-white/3 border border-white/5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <p className="text-xs text-slate-500">
                <span className="text-success font-semibold">Green highlights</span> show AEO improvements: definitions, statistics, question headings, and structured lists.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
