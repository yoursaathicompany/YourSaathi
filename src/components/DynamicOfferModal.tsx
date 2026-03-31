'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, X, Gift, Sparkles } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Offer {
  id: string;
  name: string;
  type: 'signup_bonus' | 'custom';
  coin_amount: number;
  max_recipients: number | null;
  remaining: number | null;
  modal_title: string | null;
  modal_body: string | null;
  ends_at: string | null;
}

type ClaimState =
  | { status: 'idle' }
  | { status: 'claiming' }
  | { status: 'claimed'; coins_awarded: number; new_balance: number }
  | { status: 'error'; message: string };

const SESSION_DISMISSED_KEY = 'ys_dismissed_offers';

// ── Confetti burst ───────────────────────────────────────────────────────────
function ConfettiRing() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * 110;
        const ty = Math.sin(rad) * 110;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 text-xl pointer-events-none"
            style={{ marginLeft: -12, marginTop: -12 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x: tx, y: ty, opacity: [1, 1, 0], scale: [0, 1.4, 0.8] }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.03 }}
          >
            🪙
          </motion.div>
        );
      })}
    </>
  );
}

// ── Single Offer Modal ───────────────────────────────────────────────────────
function OfferModal({
  offer,
  onDismiss,
}: {
  offer: Offer;
  onDismiss: (claimed: boolean) => void;
}) {
  const [claimState, setClaimState] = useState<ClaimState>({ status: 'idle' });
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClaim = async () => {
    if (claimState.status === 'claiming' || claimState.status === 'claimed') return;
    setClaimState({ status: 'claiming' });

    try {
      const res = await fetch('/api/user/offers/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer_id: offer.id }),
      });
      const data = await res.json();

      if (data.granted) {
        setShowConfetti(true);
        setClaimState({
          status: 'claimed',
          coins_awarded: data.coins_awarded,
          new_balance: data.new_balance,
        });
        setTimeout(() => setShowConfetti(false), 1500);
        window.dispatchEvent(new Event('coinBalanceUpdate'));
      } else {
        setClaimState({ status: 'error', message: data.error ?? 'Failed to claim' });
      }
    } catch {
      setClaimState({ status: 'error', message: 'Network error. Please try again.' });
    }
  };

  const title = offer.modal_title || `🎁 ${offer.name}`;
  const body = offer.modal_body || `Claim ${offer.coin_amount} free coins from this special offer!`;
  const isClaimed = claimState.status === 'claimed';
  const isClaiming = claimState.status === 'claiming';

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isClaimed ? () => onDismiss(false) : undefined}
        />

        {/* Modal */}
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
              border: '1px solid rgba(250,204,21,0.25)',
              boxShadow: '0 0 0 1px rgba(250,204,21,0.08), 0 25px 80px rgba(0,0,0,0.7), 0 0 60px rgba(250,204,21,0.12)',
            }}
          >
            {/* Glow */}
            <div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.25) 0%, transparent 70%)' }}
            />

            {/* Close button */}
            {!isClaimed && (
              <button
                onClick={() => onDismiss(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}

            <div className="relative z-10 p-8 text-center">
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center mb-5">
                {isClaimed && showConfetti && <ConfettiRing />}
                <motion.div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(250,204,21,0.2) 0%, rgba(251,191,36,0.1) 100%)',
                    border: '2px solid rgba(250,204,21,0.4)',
                    boxShadow: '0 0 30px rgba(250,204,21,0.25)',
                  }}
                  animate={isClaimed ? { scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {isClaimed ? '🎉' : offer.type === 'signup_bonus' ? '🪙' : '🎁'}
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                {!isClaimed ? (
                  <motion.div
                    key="pre"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {/* Remaining badge */}
                    {offer.remaining != null && (
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        LIMITED — Only {offer.remaining} {offer.remaining === 1 ? 'spot' : 'spots'} left
                      </div>
                    )}

                    <h2 className="text-2xl font-extrabold text-white mb-2 leading-tight">{title}</h2>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">{body}</p>

                    {/* Coin pill */}
                    <div
                      className="flex items-center justify-center gap-3 py-3 px-5 rounded-2xl mx-auto mb-6 w-fit"
                      style={{ background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.2)' }}
                    >
                      <span className="text-3xl">🪙</span>
                      <span className="text-4xl font-black text-yellow-400">+{offer.coin_amount}</span>
                      <span className="text-gray-400 text-sm font-medium">coins</span>
                    </div>

                    {/* Error */}
                    {claimState.status === 'error' && (
                      <p className="text-red-400 text-sm mb-3">{claimState.message}</p>
                    )}

                    {/* CTA */}
                    <motion.button
                      className="w-full py-4 rounded-2xl font-bold text-lg text-black relative overflow-hidden"
                      style={{
                        background: isClaiming ? 'rgba(250,204,21,0.5)' : 'linear-gradient(135deg, #facc15 0%, #fb923c 100%)',
                        boxShadow: isClaiming ? 'none' : '0 4px 24px rgba(250,204,21,0.4)',
                      }}
                      whileHover={!isClaiming ? { scale: 1.02 } : {}}
                      whileTap={!isClaiming ? { scale: 0.98 } : {}}
                      onClick={handleClaim}
                      disabled={isClaiming}
                    >
                      {isClaiming ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                            className="inline-block w-5 h-5 border-2 border-black/40 border-t-black/80 rounded-full"
                          />
                          Claiming…
                        </span>
                      ) : (
                        `🎁 Claim ${offer.coin_amount} Coins`
                      )}
                    </motion.button>

                    <button
                      className="mt-3 w-full text-gray-500 text-sm py-2 hover:text-gray-300 transition-colors"
                      onClick={() => onDismiss(false)}
                    >
                      Maybe later
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="post"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                      style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}
                    >
                      ✓ CLAIMED
                    </div>

                    <h2 className="text-3xl font-extrabold text-white mb-2">You got it! 🎉</h2>
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      <span className="text-yellow-400 font-bold">+{(claimState as any).coins_awarded} coins</span>{' '}
                      have been added to your wallet.
                    </p>

                    {/* New balance */}
                    <div
                      className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl mx-auto mb-6"
                      style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.25)' }}
                    >
                      <span className="text-3xl">🪙</span>
                      <div className="text-left">
                        <div className="text-xs text-gray-400 font-medium uppercase tracking-widest">New Balance</div>
                        <div className="text-3xl font-black text-yellow-400">{(claimState as any).new_balance}</div>
                      </div>
                    </div>

                    <motion.button
                      className="w-full py-4 rounded-2xl font-bold text-base text-black"
                      style={{ background: 'linear-gradient(135deg, #facc15 0%, #fb923c 100%)', boxShadow: '0 4px 24px rgba(250,204,21,0.35)' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onDismiss(true)}
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
    </AnimatePresence>
  );
}

// ── Main controller — queues and shows all auto offers ───────────────────────
export default function DynamicOfferModal() {
  const { data: session, status } = useSession();
  const [queue, setQueue] = useState<Offer[]>([]);
  const hasFetched = useRef(false);

  const fetchOffers = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Read already-dismissed from sessionStorage
    const dismissedRaw = sessionStorage.getItem(SESSION_DISMISSED_KEY);
    const dismissed: string[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];

    try {
      const res = await fetch('/api/user/offers?type=auto');
      const data = await res.json();
      const eligible: Offer[] = (data.offers ?? []).filter(
        (o: Offer) => !dismissed.includes(o.id)
      );
      setQueue(eligible);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchOffers();
    }
  }, [status, session?.user?.id, fetchOffers]);

  const handleDismiss = (offerId: string) => {
    // Mark as dismissed so it doesn't reappear this session
    const dismissedRaw = sessionStorage.getItem(SESSION_DISMISSED_KEY);
    const dismissed: string[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];
    dismissed.push(offerId);
    sessionStorage.setItem(SESSION_DISMISSED_KEY, JSON.stringify(dismissed));

    // Remove from queue
    setQueue(prev => prev.filter(o => o.id !== offerId));
  };

  // Show the first offer in the queue
  const current = queue[0] ?? null;
  if (!current) return null;

  return (
    <OfferModal
      key={current.id}
      offer={current}
      onDismiss={() => handleDismiss(current.id)}
    />
  );
}
