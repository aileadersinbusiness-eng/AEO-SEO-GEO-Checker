"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { Upload, Zap, FileText, X, RotateCcw } from "lucide-react";
import { analyzeContent } from "@/lib/analyzer";
import { AnalysisResult } from "@/lib/types";
import { SAMPLE_ARTICLE } from "@/lib/sampleContent";
import LoadingAnimation from "./LoadingAnimation";
import Results from "./Results";

export default function Analyzer() {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const handleAnalyze = useCallback(() => {
    if (!content.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setResult(null);
  }, [content, isAnalyzing]);

  const handleAnalysisComplete = useCallback(() => {
    const analysis = analyzeContent(content);
    setResult(analysis);
    setIsAnalyzing(false);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }, [content]);

  const handleSampleContent = () => {
    setContent(SAMPLE_ARTICLE);
    setResult(null);
    textareaRef.current?.focus();
  };

  const handleReset = () => {
    setContent("");
    setResult(null);
    setIsAnalyzing(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "text/plain" || file.name.endsWith(".md"))) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setContent((ev.target?.result as string) || "");
      };
      reader.readAsText(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setContent((ev.target?.result as string) || "");
      };
      reader.readAsText(file);
    }
  };

  return (
    <section id="analyze" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 border border-primary/20 mb-6">
            <Zap size={13} className="text-primary" />
            <span className="text-xs font-medium text-slate-300">AI-Powered Analysis Engine</span>
          </div>
          <h2 className="font-tight text-4xl lg:text-5xl font-bold mb-4">
            Analyze Your <span className="gradient-text">Content</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Paste any article, blog post, or LinkedIn content below for instant AEO scoring.
          </p>
        </motion.div>

        {/* Main Analyzer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl border border-white/8 overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-danger/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{wordCount.toLocaleString()} words</span>
              <span className="text-white/10">|</span>
              <span>{charCount.toLocaleString()} chars</span>
            </div>
            <div className="flex items-center gap-2">
              {content && (
                <button
                  onClick={handleReset}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded"
                >
                  <X size={14} />
                </button>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-white/5"
              >
                <Upload size={12} />
                Upload file
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          </div>

          {/* Textarea */}
          <div
            className={`relative transition-colors ${isDragOver ? "bg-primary/5" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your article, blog post, or LinkedIn content here...&#10;&#10;Or drag & drop a .txt or .md file"
              className="w-full h-64 bg-transparent px-5 py-4 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none leading-relaxed"
            />

            {isDragOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 border-2 border-dashed border-primary/40 rounded-xl m-2">
                <div className="text-center">
                  <Upload size={32} className="text-primary mx-auto mb-2" />
                  <p className="text-primary font-semibold text-sm">Drop your file here</p>
                  <p className="text-slate-500 text-xs">Supports .txt and .md files</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="px-5 py-4 border-t border-white/5 flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(124,58,237,0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAnalyze}
              disabled={!content.trim() || isAnalyzing}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-500 text-white px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Zap size={16} />
              Analyze AEO Visibility
            </motion.button>

            <button
              onClick={handleSampleContent}
              className="flex items-center gap-2 glass border border-white/10 text-slate-300 hover:text-white px-4 py-3 rounded-xl text-sm font-medium hover:border-white/20 transition-all"
            >
              <FileText size={14} />
              Try Sample Article
            </button>

            {content && !result && !isAnalyzing && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-300 px-3 py-3 rounded-xl text-sm transition-colors"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            )}

            <div className="ml-auto text-xs text-slate-600">
              {content.trim() ? (
                <span className="text-primary/70">Ready to analyze</span>
              ) : (
                "Paste content to begin"
              )}
            </div>
          </div>
        </motion.div>

        {/* Loading Animation */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              <LoadingAnimation onComplete={handleAnalysisComplete} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !isAnalyzing && (
            <div id="results">
              <Results result={result} originalContent={content} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
