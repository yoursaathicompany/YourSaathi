'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Shield, CheckCircle, Loader2, CreditCard, Lock } from 'lucide-react';

interface MockTestPaywallProps {
  onClose?: () => void;
  onSuccess?: (creditsGranted: number) => void;
  embedded?: boolean; // if true, renders as card instead of modal
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export default function MockTestPaywall({ onClose, onSuccess, embedded = false }: MockTestPaywallProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError('');

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Payment gateway failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Create order
      const orderRes = await fetch('/api/mock-test/payment/create-order', { method: 'POST' });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order_id) {
        setError(orderData.error || 'Failed to create payment order.');
        setLoading(false);
        return;
      }

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'YourSaathi',
        description: '50 AI Mock Tests Pack',
        order_id: orderData.order_id,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch('/api/mock-test/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccess(true);
              onSuccess?.(verifyData.credits_granted);
            } else {
              setError(verifyData.error || 'Payment verification failed.');
            }
          } catch {
            setError('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {},
        theme: { color: '#7C3AED' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const content = (
    <div className="relative">
      {!embedded && onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-4"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h3>
            <p className="text-gray-400 mb-2">50 mock tests have been unlocked for you.</p>
            <p className="text-green-400 font-semibold">You can now generate your first AI mock test!</p>
          </motion.div>
        ) : (
          <motion.div key="paywall" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Unlock AI Mock Tests</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Generate unlimited high-quality mock tests for any competitive exam
              </p>
            </div>

            {/* Price Card */}
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-indigo-900/30 p-5 mb-5">
              <div className="absolute top-0 right-0 bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl">
                BEST VALUE
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-black text-white">₹49</span>
                <span className="text-gray-400 mb-1 line-through text-lg">₹199</span>
                <span className="text-green-400 text-sm font-semibold mb-1">75% OFF</span>
              </div>
              <ul className="space-y-2">
                {[
                  '50 AI-Generated Mock Tests',
                  'SSC, UPSC, Banking, Railway & more',
                  'Instant Results + Explanations',
                  'Easy, Medium & Hard difficulty',
                  'English & Hindi language support',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* CTA Button */}
            <motion.button
              onClick={handlePurchase}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-purple-500/25 text-lg"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <><CreditCard className="w-5 h-5" /> Pay ₹49 — Unlock 50 Tests</>
              )}
            </motion.button>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
              <Lock className="w-3 h-3" />
              <span>Secured by Razorpay • 100% Safe Payment</span>
              <Shield className="w-3 h-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (embedded) {
    return (
      <div className="w-full max-w-md mx-auto bg-[#18181B] border border-white/10 rounded-3xl p-8">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-[#18181B] border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        {content}
      </motion.div>
    </div>
  );
}
