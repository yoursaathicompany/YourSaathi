"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-50" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 flex items-center justify-center transition-colors overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : -90,
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0
        }}
        transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 10 }}
        className="absolute inset-0 flex items-center justify-center text-purple-400"
      >
        <Moon className="w-5 h-5" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 90 : 0,
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1
        }}
        transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 10 }}
        className="absolute inset-0 flex items-center justify-center text-yellow-500"
      >
        <Sun className="w-5 h-5" />
      </motion.div>
    </motion.button>
  );
}
