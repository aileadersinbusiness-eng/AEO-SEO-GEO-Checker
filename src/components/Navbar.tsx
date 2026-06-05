"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-tight font-bold text-lg gradient-text">AEO</span>
            <span className="text-slate-300 font-medium text-sm">Visibility Analyzer</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Analyze"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase().replace(/\s+/g, "-"))}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {item}
            </button>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => scrollTo("analyze")}
          className="bg-primary hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          Analyze Content
        </motion.button>
      </div>
    </motion.nav>
  );
}
