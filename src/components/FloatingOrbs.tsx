"use client";

import { motion } from "framer-motion";

export default function FloatingOrbs() {
  const orbs = [
    { size: 400, x: "10%", y: "20%", color: "rgba(124,58,237,0.15)", duration: 8 },
    { size: 300, x: "80%", y: "10%", color: "rgba(6,182,212,0.12)", duration: 10 },
    { size: 250, x: "60%", y: "70%", color: "rgba(245,158,11,0.08)", duration: 12 },
    { size: 200, x: "30%", y: "80%", color: "rgba(124,58,237,0.1)", duration: 9 },
    { size: 350, x: "90%", y: "50%", color: "rgba(6,182,212,0.08)", duration: 11 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
