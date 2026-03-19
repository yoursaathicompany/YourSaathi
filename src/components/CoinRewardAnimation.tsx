'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoinRewardAnimationProps {
  coinsAwarded: number;
  active: boolean;
  onComplete?: () => void;
  /** Set to true to skip animation (respects prefers-reduced-motion) */
  reduced?: boolean;
  /** Origin element ref for flying coin start position */
  originRef?: React.RefObject<HTMLElement | null>;
  /** Target element ref for flying coin destination */
  targetRef?: React.RefObject<HTMLElement | null>;
}

function FlyingCoin({ from, to, delay, onComplete }: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay: number;
  onComplete?: () => void;
}) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ position: 'fixed', left: from.x, top: from.y, zIndex: 9999 }}
      animate={{
        x: to.x - from.x,
        y: to.y - from.y,
        scale: [1, 1.3, 0.5],
        opacity: [1, 1, 0],
      }}
      transition={{ duration: 0.8, delay, ease: 'easeInOut' }}
      onAnimationComplete={onComplete}
      className="w-6 h-6 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50 flex items-center justify-center text-xs"
    >
      🪙
    </motion.div>
  );
}

export default function CoinRewardAnimation({
  coinsAwarded,
  active,
  onComplete,
  reduced = false,
  originRef,
  targetRef,
}: CoinRewardAnimationProps) {
  const confettiRef = useRef<typeof import('canvas-confetti') | null>(null);

  useEffect(() => {
    if (!active || coinsAwarded <= 0 || reduced) return;
    // Dynamically import canvas-confetti for tree-shaking
    import('canvas-confetti').then((mod) => {
      confettiRef.current = mod.default;
      mod.default({
        particleCount: Math.min(coinsAwarded * 8, 120),
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#facc15', '#fbbf24', '#f59e0b', '#d97706', '#ffffff'],
        zIndex: 10000,
      });
    });
  }, [active, coinsAwarded, reduced]);

  if (!active || coinsAwarded <= 0) return null;

  // Static badge for reduced motion
  if (reduced) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 bg-yellow-400 text-gray-900 font-bold px-5 py-3 rounded-2xl shadow-xl text-lg animate-none"
      >
        🪙 +{coinsAwarded} coins earned!
      </div>
    );
  }

  // Calculate flying coin positions
  const fromRect = originRef?.current?.getBoundingClientRect();
  const toRect = targetRef?.current?.getBoundingClientRect();
  const from = fromRect ? { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const to = toRect ? { x: toRect.left + toRect.width / 2, y: toRect.top + toRect.height / 2 } : { x: window.innerWidth - 80, y: 20 };

  const coinCount = Math.min(coinsAwarded, 8);

  return (
    <AnimatePresence>
      <>
        {/* Flying coins */}
        {Array.from({ length: coinCount }).map((_, i) => (
          <FlyingCoin
            key={i}
            from={{ x: from.x + (Math.random() - 0.5) * 40, y: from.y + (Math.random() - 0.5) * 20 }}
            to={to}
            delay={i * 0.08}
            onComplete={i === coinCount - 1 ? onComplete : undefined}
          />
        ))}

        {/* Toast */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.2 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-5 py-3 rounded-2xl shadow-xl shadow-yellow-500/30"
        >
          <span className="text-2xl">🪙</span>
          <div>
            <div className="text-lg leading-tight">+{coinsAwarded} coins!</div>
            <div className="text-xs font-normal opacity-70">Keep going to earn more</div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
