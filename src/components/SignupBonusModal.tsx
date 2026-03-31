'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

type BonusState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'eligible'; remaining_slots: number; bonus_amount: number }
  | { status: 'claiming' }
  | { status: 'claimed'; coins_awarded: number; new_balance: number; recipients_so_far: number }
  | { status: 'not_eligible'; reason: string }
  | { status: 'error' };

const STORAGE_KEY = 'ys_bonus_dismissed';

// ── Floating coin particle ────────────────────────────────────────────────────
function FloatingCoin({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute text-2xl pointer-events-none select-none"
      style={style}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 15, -15, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2 + Math.random() * 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: Math.random() * 1.5,
      }}
    >
      🪙
    </motion.div>
  );
}

// ── Confetti burst on claim ───────────────────────────────────────────────────
function ConfettiRing() {
  const coins = Array.from({ length: 12 });
  return (
    <>
      {coins.map((_, i) => {
        const angle = (i / coins.length) * 360;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * 110;
        const ty = Math.sin(rad) * 110;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 text-xl pointer-events-none"
            style={{ marginLeft: -12, marginTop: -12 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
              x: tx,
              y: ty,
              opacity: [1, 1, 0],
              scale: [0, 1.4, 0.8],
            }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.03 }}
          >
            🪙
          </motion.div>
        );
      })}
    </>
  );
}

export default function SignupBonusModal() {
  const { data: session, status: sessionStatus } = useSession();
  const [bonusState, setBonusState] = useState<BonusState>({ status: 'idle' });
  const [showConfetti, setShowConfetti] = useState(false);
  const hasChecked = useRef(false);

  // Check eligibility once the session is ready
  const checkEligibility = useCallback(async () => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    // If user already dismissed in this browser session, skip
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    setBonusState({ status: 'checking' });
    try {
      const res = await fetch('/api/user/signup-bonus', { method: 'GET' });
      const data = await res.json();

      if (data.eligible) {
        setBonusState({
          status: 'eligible',
          remaining_slots: data.remaining_slots,
          bonus_amount: data.bonus_amount,
        });
      } else {
        setBonusState({ status: 'not_eligible', reason: data.reason });
      }
    } catch {
      setBonusState({ status: 'error' });
    }
  }, []);

  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.id) {
      checkEligibility();
    }
  }, [sessionStatus, session?.user?.id, checkEligibility]);

  const handleClaim = async () => {
    if (bonusState.status !== 'eligible') return;
    setBonusState((prev) => ({ ...prev, status: 'claiming' } as BonusState));

    try {
      const res = await fetch('/api/user/signup-bonus', { method: 'POST' });
      const data = await res.json();

      if (data.granted) {
        setShowConfetti(true);
        setBonusState({
          status: 'claimed',
          coins_awarded: data.coins_awarded,
          new_balance: data.new_balance,
          recipients_so_far: data.recipients_so_far,
        });
        setTimeout(() => setShowConfetti(false), 1500);

        // 🔔 Tell the navbar (and profile page) to refresh the wallet balance
        window.dispatchEvent(new Event('coinBalanceUpdate'));
      } else {
        setBonusState({ status: 'not_eligible', reason: data.reason });
      }
    } catch {
      setBonusState({ status: 'error' });
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setBonusState({ status: 'not_eligible', reason: 'dismissed' });
  };

  const isVisible =
    bonusState.status === 'eligible' ||
    bonusState.status === 'claiming' ||
    bonusState.status === 'claimed';

  if (!isVisible) return null;

  const eligible = bonusState.status === 'eligible';
  const claiming = bonusState.status === 'claiming';
  const claimed = bonusState.status === 'claimed';

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!claimed ? handleDismiss : undefined}
          />

          {/* ── Modal ── */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          >
            <div
              className="relative w-full max-w-md overflow-hidden rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
                border: '1px solid rgba(250, 204, 21, 0.25)',
                boxShadow:
                  '0 0 0 1px rgba(250,204,21,0.08), 0 25px 80px rgba(0,0,0,0.7), 0 0 60px rgba(250,204,21,0.12)',
              }}
            >
              {/* ── Glow ring at top ── */}
              <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(250,204,21,0.25) 0%, transparent 70%)',
                }}
              />

              {/* ── Floating background coins ── */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingCoin style={{ left: '8%', top: '15%', opacity: 0.3 }} />
                <FloatingCoin style={{ right: '10%', top: '20%', opacity: 0.25 }} />
                <FloatingCoin style={{ left: '15%', bottom: '25%', opacity: 0.2 }} />
                <FloatingCoin style={{ right: '8%', bottom: '30%', opacity: 0.2 }} />
              </div>

              <div className="relative z-10 p-8 text-center">
                {/* ── Icon area ── */}
                <div className="relative inline-flex items-center justify-center mb-5">
                  {claimed && showConfetti && <ConfettiRing />}
                  <motion.div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(250,204,21,0.2) 0%, rgba(251,191,36,0.1) 100%)',
                      border: '2px solid rgba(250,204,21,0.4)',
                      boxShadow: '0 0 30px rgba(250,204,21,0.25)',
                    }}
                    animate={
                      claimed
                        ? { scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    {claimed ? '🎉' : '🪙'}
                  </motion.div>
                </div>

                {/* ── Headline ── */}
                <AnimatePresence mode="wait">
                  {!claimed ? (
                    <motion.div
                      key="pre-claim"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      {/* Limited offer badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                        style={{
                          background: 'rgba(239,68,68,0.15)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          color: '#f87171',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        LIMITED OFFER — Only {eligible ? (bonusState as {remaining_slots:number}).remaining_slots : '—'} spots left
                      </div>

                      <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">
                        Welcome Bonus
                        <br />
                        <span
                          style={{
                            background: 'linear-gradient(90deg, #facc15, #fb923c)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          🪙 100 Free Coins!
                        </span>
                      </h2>

                      <p className="text-sm text-gray-400 mb-2 leading-relaxed">
                        You're one of the first users on{' '}
                        <span className="text-yellow-400 font-semibold">YourSaathi</span>.
                        Claim your exclusive welcome bonus — valid for the first{' '}
                        <span className="text-white font-semibold">100 sign-ups only</span>.
                      </p>

                      <p className="text-xs text-gray-500 mb-6">
                        Use coins to unlock premium quizzes &amp; redeem rewards.
                      </p>

                      {/* Coin display */}
                      <div
                        className="flex items-center justify-center gap-3 py-3 px-5 rounded-2xl mx-auto mb-6 w-fit"
                        style={{
                          background: 'rgba(250,204,21,0.07)',
                          border: '1px solid rgba(250,204,21,0.2)',
                        }}
                      >
                        <span className="text-3xl">🪙</span>
                        <span className="text-4xl font-black text-yellow-400">+100</span>
                        <span className="text-gray-400 text-sm font-medium">coins</span>
                      </div>

                      {/* CTA */}
                      <motion.button
                        id="signup-bonus-claim-btn"
                        className="w-full py-4 rounded-2xl font-bold text-lg text-black relative overflow-hidden"
                        style={{
                          background: claiming
                            ? 'rgba(250,204,21,0.5)'
                            : 'linear-gradient(135deg, #facc15 0%, #fb923c 100%)',
                          boxShadow: claiming ? 'none' : '0 4px 24px rgba(250,204,21,0.4)',
                        }}
                        whileHover={!claiming ? { scale: 1.02, boxShadow: '0 6px 32px rgba(250,204,21,0.55)' } : {}}
                        whileTap={!claiming ? { scale: 0.98 } : {}}
                        onClick={handleClaim}
                        disabled={claiming}
                      >
                        {claiming ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                              className="inline-block w-5 h-5 border-2 border-black/40 border-t-black/80 rounded-full"
                            />
                            Claiming…
                          </span>
                        ) : (
                          '🎁 Claim My 100 Coins'
                        )}
                      </motion.button>

                      <button
                        id="signup-bonus-dismiss-btn"
                        className="mt-3 w-full text-gray-500 text-sm py-2 hover:text-gray-300 transition-colors"
                        onClick={handleDismiss}
                      >
                        Maybe later
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="post-claim"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                        style={{
                          background: 'rgba(34,197,94,0.15)',
                          border: '1px solid rgba(34,197,94,0.3)',
                          color: '#4ade80',
                        }}
                      >
                        ✓ BONUS CLAIMED
                      </div>

                      <h2 className="text-3xl font-extrabold text-white mb-2">
                        You got it! 🎉
                      </h2>

                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        <span className="text-yellow-400 font-bold">+{(bonusState as {coins_awarded:number}).coins_awarded} coins</span>{' '}
                        have been added to your wallet.
                        <br />
                        You are recipient{' '}
                        <span className="text-white font-semibold">
                          #{(bonusState as {recipients_so_far:number}).recipients_so_far}
                        </span>{' '}
                        out of 100 — congratulations!
                      </p>

                      {/* New balance display */}
                      <div
                        className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl mx-auto mb-6"
                        style={{
                          background: 'rgba(250,204,21,0.08)',
                          border: '1px solid rgba(250,204,21,0.25)',
                        }}
                      >
                        <span className="text-3xl">🪙</span>
                        <div className="text-left">
                          <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                            New Wallet Balance
                          </div>
                          <div className="text-3xl font-black text-yellow-400">
                            {(bonusState as {new_balance:number}).new_balance}
                          </div>
                        </div>
                      </div>

                      <motion.button
                        id="signup-bonus-continue-btn"
                        className="w-full py-4 rounded-2xl font-bold text-base text-black"
                        style={{
                          background: 'linear-gradient(135deg, #facc15 0%, #fb923c 100%)',
                          boxShadow: '0 4px 24px rgba(250,204,21,0.35)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDismiss}
                      >
                        Start Earning More Coins →
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
