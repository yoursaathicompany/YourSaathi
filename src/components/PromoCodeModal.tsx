'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; offer_name: string; coins_awarded: number; new_balance: number }
  | { status: 'error'; message: string };

export default function PromoCodeModal({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [state, setState] = useState<State>({ status: 'idle' });

  const handleOpen = () => {
    setOpen(true);
    setCode('');
    setState({ status: 'idle' });
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
    if (state.status === 'success') {
      window.dispatchEvent(new Event('coinBalanceUpdate'));
    }
  };

  const handleSubmit = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setState({ status: 'loading' });

    try {
      const res = await fetch('/api/user/offers/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promo_code: trimmed }),
      });
      const data = await res.json();

      if (data.granted) {
        setState({
          status: 'success',
          offer_name: data.offer_name,
          coins_awarded: data.coins_awarded,
          new_balance: data.new_balance,
        });
        window.dispatchEvent(new Event('coinBalanceUpdate'));
      } else {
        setState({ status: 'error', message: data.error ?? 'Invalid or expired promo code.' });
      }
    } catch {
      setState({ status: 'error', message: 'Network error. Please try again.' });
    }
  };

  const isLoading = state.status === 'loading';
  const isSuccess = state.status === 'success';

  return (
    <>
      {/* Trigger button */}
      <button
        id="promo-code-btn"
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
        style={{
          background: 'rgba(168,85,247,0.12)',
          border: '1px solid rgba(168,85,247,0.3)',
          color: '#c084fc',
        }}
      >
        <Tag className="w-4 h-4" />
        Redeem Promo Code
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            >
              <div
                className="relative w-full max-w-sm overflow-hidden rounded-3xl p-8"
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  boxShadow: '0 25px 80px rgba(0,0,0,0.7), 0 0 50px rgba(168,85,247,0.1)',
                }}
              >
                {/* Close */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>

                {!isSuccess ? (
                  <>
                    {/* Icon */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 mx-auto"
                      style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}
                    >
                      <Tag className="w-7 h-7 text-purple-400" />
                    </div>

                    <h2 className="text-2xl font-extrabold text-white text-center mb-1">Promo Code</h2>
                    <p className="text-gray-400 text-sm text-center mb-6">
                      Enter your exclusive promo code to unlock free coins.
                    </p>

                    {/* Code input */}
                    <input
                      type="text"
                      value={code}
                      onChange={e => {
                        setCode(e.target.value.toUpperCase());
                        if (state.status === 'error') setState({ status: 'idle' });
                      }}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      placeholder="ENTER CODE HERE"
                      maxLength={32}
                      disabled={isLoading}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-lg font-bold text-white tracking-widest placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 mb-3 disabled:opacity-50"
                    />

                    {/* Error */}
                    {state.status === 'error' && (
                      <div className="flex items-center gap-2 text-red-400 text-sm mb-3 justify-center">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {state.message}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading || !code.trim()}
                      className="w-full py-3.5 rounded-2xl font-bold text-base text-white transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                        boxShadow: '0 4px 20px rgba(168,85,247,0.35)',
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Checking…
                        </>
                      ) : (
                        'Apply Code'
                      )}
                    </button>
                  </>
                ) : (
                  /* Success state */
                  <div className="text-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl"
                      style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)' }}
                    >
                      🎉
                    </div>

                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}
                    >
                      <CheckCircle2 className="w-3 h-3" /> CODE APPLIED
                    </div>

                    <h2 className="text-2xl font-extrabold text-white mb-1">{(state as any).offer_name}</h2>
                    <p className="text-gray-400 text-sm mb-5">
                      <span className="text-yellow-400 font-bold">+{(state as any).coins_awarded} coins</span> added to your wallet!
                    </p>

                    <div
                      className="flex items-center justify-center gap-3 py-3 px-5 rounded-2xl mb-5"
                      style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.25)' }}
                    >
                      <span className="text-2xl">🪙</span>
                      <div className="text-left">
                        <div className="text-xs text-gray-400 uppercase tracking-widest">New Balance</div>
                        <div className="text-2xl font-black text-yellow-400">{(state as any).new_balance}</div>
                      </div>
                    </div>

                    <button
                      onClick={handleClose}
                      className="w-full py-3.5 rounded-2xl font-bold text-black"
                      style={{ background: 'linear-gradient(135deg, #facc15 0%, #fb923c 100%)' }}
                    >
                      Awesome, let's go! 🚀
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
