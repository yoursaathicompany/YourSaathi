'use client';

import { motion } from 'framer-motion';

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#09090b] bg-[#09090b] transition-colors duration-500">
      
      {/* Animated Subtle Grid */}
      <div 
        className="absolute inset-0 opacity-[0.05] opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      >
        <motion.div
           animate={{ y: [0, 80] }}
           transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
           className="absolute inset-0"
           style={{
             backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)`,
             backgroundSize: '80px 80px',
           }}
        />
      </div>

      {/* Vibrant Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
          x: [0, 150, 0],
          y: [0, -100, 0],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[600px] sm:w-[1000px] h-[600px] sm:h-[1000px] rounded-full bg-purple-500/40 bg-purple-600/30 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0.7, 0.5],
          x: [0, -150, 0],
          y: [0, 150, 0],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-20%] right-[-10%] w-[800px] sm:w-[1200px] h-[800px] sm:h-[1200px] rounded-full bg-blue-500/40 bg-blue-600/30 blur-[140px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[20%] left-[40%] w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full bg-pink-500/40 bg-pink-600/30 blur-[100px]"
      />

      <div className="absolute inset-0 bg-white/30 bg-[#09090b]/50 backdrop-blur-[60px]" />
    </div>
  );
}
