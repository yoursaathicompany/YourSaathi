'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';
import Link from 'next/link';

interface CoinWalletHeaderProps {
  balance: number;
  previousBalance?: number;
  animate?: boolean;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function useCountUp(target: number, from: number, duration: number, shouldAnimate: boolean) {
  const [value, setValue] = useState(from);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldAnimate || from === target) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const range = target - from;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + range * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, from, duration, shouldAnimate]);

  return value;
}

export default function CoinWalletHeader({ balance, previousBalance, animate = false }: CoinWalletHeaderProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && !reducedMotion && previousBalance !== undefined && previousBalance !== balance;
  const displayValue = useCountUp(balance, previousBalance ?? balance, 1200, shouldAnimate);
  const gained = (previousBalance !== undefined && balance > previousBalance) ? balance - previousBalance : 0;

  return (
    <Link
      href="/profile"
      id="coin-wallet-header"
      aria-label={`Coin wallet — ${balance} coins`}
      className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 hover:border-yellow-400/50 transition-all"
    >
      <motion.div
        animate={shouldAnimate ? { rotate: [0, -10, 10, -6, 6, 0] } : {}}
        transition={{ duration: 0.6 }}
      >
        <Coins className="w-4 h-4 text-yellow-400" aria-hidden="true" />
      </motion.div>

      <span className="text-sm font-bold text-yellow-300 tabular-nums" aria-live="polite">
        {(displayValue ?? 0).toLocaleString()}
      </span>

      {/* "+N" pop-up when coins are earned */}
      <AnimatePresence>
        {gained > 0 && animate && !reducedMotion && (
          <motion.span
            key={gained}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: -24, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute -top-1 -right-1 text-xs font-bold text-yellow-300 pointer-events-none select-none"
            aria-hidden="true"
          >
            +{gained}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
