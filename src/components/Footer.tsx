"use client";


import { Zap, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-tight font-bold text-sm gradient-text">AEO</span>
                <span className="text-slate-400 font-medium text-xs">Visibility Analyzer</span>
              </div>
              <div className="text-slate-600 text-xs">Will AI Search Recommend Your Content?</div>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-slate-500">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-slate-300 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Powered by */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Powered by advanced AI analysis</span>
            <Heart size={11} className="text-danger/60" />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-slate-700 text-xs">
            &copy; {new Date().getFullYear()} AEO Visibility Analyzer. Built for content creators optimizing for the AI-first search era.
          </p>
        </div>
      </div>
    </footer>
  );
}
