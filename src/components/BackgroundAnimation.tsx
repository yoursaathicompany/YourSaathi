'use client';

import { motion } from 'framer-motion';

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] rounded-full bg-purple-400/20 dark:bg-purple-900/30 blur-[100px] sm:blur-[140px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full bg-pink-400/20 dark:bg-pink-900/20 blur-[120px] sm:blur-[160px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[30%] left-[50%] w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[90px] sm:blur-[130px]"
      />
      <div className="absolute inset-0 bg-white/20 dark:bg-[#09090b]/40 backdrop-blur-[50px] sm:backdrop-blur-[80px]" />
    </div>
  );
}
