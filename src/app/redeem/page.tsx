'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Coins, ArrowRight, CheckCircle2, AlertCircle,
  Loader2, History, Info, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CoinBalanceDisplay from '@/components/CoinBalanceDisplay';
import TierSelector from '@/components/TierSelector';
import WithdrawalStatusBadge from '@/components/WithdrawalStatusBadge';
import { validateUpiId, formatINR } from '@/lib/withdrawal-utils';
import type { WithdrawalTier, UserWallet, Withdrawal } from '@/types/withdrawal';
import Link from 'next/link';

export default function RedeemPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [wallet, setWallet]               = useState<UserWallet | null>(null);
  const [tiers, setTiers]                 = useState<WithdrawalTier[]>([]);
  const [pendingWithdrawal, setPending]   = useState<Withdrawal | null>(null);
  const [selectedTier, setSelectedTier]   = useState<WithdrawalTier | null>(null);
  const [upiId, setUpiId]                 = useState('');
  const [upiError, setUpiError]           = useState('');
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [successMsg, setSuccessMsg]       = useState('');
  const [errorMsg, setErrorMsg]           = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [walletRes, tiersRes, histRes] = await Promise.all([
        fetch('/api/withdrawals/balance'),
        fetch('/api/withdrawals/tiers'),
        fetch('/api/withdrawals?limit=1'),
      ]);

      if (walletRes.ok) setWallet(await walletRes.json());
      if (tiersRes.ok) {
        const d = await tiersRes.json();
        setTiers(d.tiers ?? []);
      }
      if (histRes.ok) {
        const d = await histRes.json();
        const first: Withdrawal | undefined = d.withdrawals?.[0];
        if (first?.status === 'pending') setPending(first);
        else setPending(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'unauthenticated') router.replace('/login');
    if (authStatus === 'authenticated') fetchData();
  }, [authStatus, fetchData, router]);

  const handleUpiChange = (val: string) => {
    setUpiId(val);
    if (val && !validateUpiId(val)) {
      setUpiError('Format: yourname@bankhandle  (e.g. john@okicici)');
    } else {
      setUpiError('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedTier) { setErrorMsg('Please select a redemption tier.'); return; }
    if (!validateUpiId(upiId)) { setUpiError('Please enter a valid UPI ID.'); return; }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier_id: selectedTier.id, upi_id: upiId.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
      } else {
        setSuccessMsg(data.message ?? 'Withdrawal request submitted!');
        setSelectedTier(null);
        setUpiId('');
        await fetchData();
        window.dispatchEvent(new Event('coinBalanceUpdate'));
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !!(
    selectedTier &&
    validateUpiId(upiId) &&
    !submitting &&
    !pendingWithdrawal &&
    (wallet?.available_balance ?? 0) >= (selectedTier?.coins_required ?? 0)
  );

  if (authStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            Redeem Coins
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Convert your earned coins into real money via UPI</p>
        </div>
        <Link
          href="/redeem/history"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20"
        >
          <History className="w-4 h-4" />
          History
        </Link>
      </div>

      {/* Pending withdrawal banner */}
      <AnimatePresence>
        {pendingWithdrawal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-4 p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-300">Withdrawal Pending</p>
              <p className="text-sm text-amber-400/70 mt-0.5">
                ₹{Number(pendingWithdrawal.requested_amount).toLocaleString('en-IN')} withdrawal to{' '}
                <span className="font-mono">{pendingWithdrawal.upi_id}</span> is under review.
                You can submit another request once this is resolved.
              </p>
            </div>
            <WithdrawalStatusBadge status="pending" size="sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coin Balance */}
      <div className="mb-8">
        <CoinBalanceDisplay wallet={wallet} loading={loading} />
      </div>

      {/* Tier Selection */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 text-gray-300">Choose Redemption Amount</h2>
        <TierSelector
          tiers={tiers}
          wallet={wallet}
          selectedTierId={selectedTier?.id ?? null}
          onSelect={(tier) => {
            setSelectedTier(tier);
            setErrorMsg('');
            setSuccessMsg('');
          }}
          disabled={!!pendingWithdrawal}
        />
      </div>

      {/* UPI Input & Submit */}
      {!pendingWithdrawal && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
          <h2 className="text-lg font-bold mb-1 text-gray-300 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-400" />
            UPI Details
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            Enter your UPI ID to receive the payment. Double-check before submitting.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">UPI ID</label>
              <input
                type="text"
                id="upi-id-input"
                value={upiId}
                onChange={(e) => handleUpiChange(e.target.value)}
                placeholder="e.g. yourname@okicici"
                autoComplete="off"
                spellCheck={false}
                className={`w-full bg-black/30 border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-colors font-mono text-sm ${
                  upiError
                    ? 'border-red-500/50 focus:ring-red-500/30'
                    : 'border-white/10 focus:ring-purple-500/30 focus:border-purple-500/50'
                }`}
              />
              {upiError && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {upiError}
                </p>
              )}
            </div>

            {selectedTier && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl"
              >
                <div>
                  <p className="text-sm font-semibold text-white">Order Summary</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedTier.coins_required.toLocaleString('en-IN')} coins →{' '}
                    {formatINR(selectedTier.rupee_amount)} via UPI
                  </p>
                </div>
                <div className="text-2xl font-black text-green-400">
                  ₹{Number(selectedTier.rupee_amount).toLocaleString('en-IN')}
                </div>
              </motion.div>
            )}

            <button
              id="btn-submit-withdrawal"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:shadow-none text-base"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <>Submit Withdrawal <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            <p className="text-xs text-center text-gray-600">
              Withdrawals are reviewed within 1–3 business days. Coins will be locked until processed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
