"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Scan, Brain, Search, FileSearch, Lightbulb } from "lucide-react";

const steps = [
  { icon: Scan, label: "Scanning content structure..." },
  { icon: Brain, label: "Analyzing entity coverage..." },
  { icon: Search, label: "Evaluating question coverage..." },
  { icon: FileSearch, label: "Calculating citation potential..." },
  { icon: Lightbulb, label: "Generating recommendations..." },
];

interface Props {
  onComplete: () => void;
}

export default function LoadingAnimation({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 600;
    const totalSteps = steps.length;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        setProgress(Math.round((next / totalSteps) * 100));
        if (next >= totalSteps) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
        }
        return next;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass rounded-2xl p-8 border border-primary/20 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
          />
          <div className="absolute inset-2 rounded-full bg-primary/20 flex items-center justify-center">
            <Brain size={14} className="text-primary" />
          </div>
        </div>
        <div>
          <div className="font-tight font-bold text-white text-sm">Analyzing AEO Visibility</div>
          <div className="text-xs text-slate-500">Processing your content...</div>
        </div>
        <div className="ml-auto font-tight font-bold gradient-text text-lg">{progress}%</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isDone = i < currentStep;
          const isActive = i === currentStep;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? "bg-primary/10 border border-primary/20" :
                isDone ? "opacity-60" : ""
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDone ? "bg-success/20" : isActive ? "bg-primary/20" : "bg-white/5"
              }`}>
                {isDone ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    viewBox="0 0 12 12" className="w-3 h-3"
                  >
                    <path d="M2 6l3 3 5-5" stroke="#10B981" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </motion.svg>
                ) : (
                  <Icon size={12} className={isActive ? "text-primary" : "text-slate-600"} />
                )}
              </div>
              <span className={`text-sm ${isDone ? "text-slate-400 line-through" : isActive ? "text-white" : "text-slate-600"}`}>
                {step.label}
              </span>
              {isActive && (
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Scan effect */}
      <div className="relative h-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-secondary to-transparent"
          animate={{ x: ["-80px", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
