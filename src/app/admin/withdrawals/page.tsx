'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Shield, Loader2, RefreshCw, CheckCircle2, XCircle,
  CreditCard, ChevronDown, ChevronUp, User, Coins,
  AlertCircle, ArrowLeft, Filter
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import WithdrawalStatusBadge from '@/components/WithdrawalStatusBadge';
import type { Withdrawal, WithdrawalStatus } from '@/types/withdrawal';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Paid', value: 'paid' },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

interface ActionModalProps {
  withdrawal: Withdrawal;
  action: 'approve' | 'reject' | 'paid';
  onClose: () => void;
  onSuccess: () => void;
}

function ActionModal({ withdrawal, action, onClose, onSuccess }: ActionModalProps) {
  const [notes, setNotes]         = useState('');
  const [payRef, setPayRef]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const endpoint = `/api/admin/withdrawals/${withdrawal.id}/${action === 'paid' ? 'mark-paid' : action}`;
  const titles   = { approve: 'Approve Withdrawal', reject: 'Reject Withdrawal', paid: 'Mark as Paid' };
  const colors   = {
    approve: 'from-blue-600 to-blue-500',
    reject:  'from-red-600 to-red-500',
    paid:    'from-green-600 to-green-500',
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const body: Record<string, string> = {};
      if (action === 'reject' && notes) body.admin_notes = notes;
      if (action === 'paid' && payRef)  body.payout_reference = payRef;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#111113] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-1">{titles[action]}</h3>

        {/* Withdrawal Summary */}
        <div className="bg-white/5 rounded-2xl p-4 mb-5 mt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">User</span>
            <span className="text-white font-medium">{(withdrawal as any).user?.display_name ?? (withdrawal as any).user?.email ?? '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount</span>
            <span className="text-green-400 font-bold">₹{Number(withdrawal.requested_amount).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Coins</span>
            <span className="text-yellow-400 font-medium">{withdrawal.coins_required.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">UPI ID</span>
            <span className="text-white font-mono text-xs">{withdrawal.upi_id}</span>
          </div>
        </div>

        {/* Reject notes */}
        {action === 'reject' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Reason / Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="e.g. UPI ID not found, insufficient verification..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 resize-none"
            />
          </div>
        )}

        {/* Payout reference */}
        {action === 'paid' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Payout Reference / UTR (optional)</label>
            <input
              type="text"
              value={payRef}
              onChange={(e) => setPayRef(e.target.value)}
              placeholder="e.g. UTR123456789012"
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 font-mono"
            />
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${colors[action]} text-white text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface ExpandedRowProps {
  withdrawal: Withdrawal;
  onAction: (w: Withdrawal, action: 'approve' | 'reject' | 'paid') => void;
}

function WithdrawalRow({ withdrawal: w, onAction }: ExpandedRowProps) {
  const [expanded, setExpanded] = useState(false);
  const user = (w as any).user;

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
      <button
        className="w-full text-left p-5 flex items-center gap-4"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 min-w-0">
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <User className="w-3 h-3" /> User
            </p>
            <p className="text-sm text-white font-medium truncate">
              {user?.display_name ?? user?.email ?? '—'}
            </p>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Amount</p>
            <p className="text-sm font-bold text-green-400">
              ₹{Number(w.requested_amount).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-yellow-500 flex items-center gap-1">
              <Coins className="w-3 h-3" />
              {w.coins_required.toLocaleString('en-IN')} coins
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">UPI ID</p>
            <p className="text-xs font-mono text-gray-300 truncate">{w.upi_id}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <WithdrawalStatusBadge status={w.status} size="sm" />
            <p className="text-xs text-gray-600">{formatDate(w.created_at)}</p>
          </div>
        </div>
        <div className="ml-2 text-gray-600">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/5 pt-4">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {w.admin_notes && (
                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Admin Notes</p>
                    <p className="text-sm text-amber-300">{w.admin_notes}</p>
                  </div>
                )}
                {w.payout_reference && (
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Payout Reference</p>
                    <p className="text-sm font-mono text-blue-300">{w.payout_reference}</p>
                  </div>
                )}
                {w.paid_at && (
                  <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Paid At</p>
                    <p className="text-sm text-green-300">{formatDate(w.paid_at)}</p>
                  </div>
                )}
                {w.approved_at && (
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Approved At</p>
                    <p className="text-sm text-blue-300">{formatDate(w.approved_at)}</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap">
                {w.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onAction(w, 'approve')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 text-sm font-semibold transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => onAction(w, 'reject')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-sm font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}
                {w.status === 'approved' && (
                  <button
                    onClick={() => onAction(w, 'paid')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 text-sm font-semibold transition-colors"
                  >
                    <CreditCard className="w-4 h-4" /> Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminWithdrawalsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [withdrawals, setWithdrawals]   = useState<Withdrawal[]>([]);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [statusFilter, setFilter]       = useState('');
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [modal, setModal]               = useState<{ withdrawal: Withdrawal; action: 'approve' | 'reject' | 'paid' } | null>(null);
  const LIMIT = 20;

  const isAdmin = (session?.user as any)?.role === 'admin';

  const fetchWithdrawals = useCallback(async (p: number, filter: string, showSpin = false) => {
    if (showSpin) setRefreshing(true);
    else setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (filter) params.set('status', filter);
      const res = await fetch(`/api/admin/withdrawals?${params}`);
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data.withdrawals ?? []);
        setTotal(data.total ?? 0);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === 'unauthenticated') router.replace('/login');
    if (authStatus === 'authenticated') {
      if (!isAdmin) router.replace('/');
      else fetchWithdrawals(page, statusFilter);
    }
  }, [authStatus, isAdmin, page, statusFilter, fetchWithdrawals, router]);

  const totalPages = Math.ceil(total / LIMIT);

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

  if (authStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-400" />
              Withdrawal Management
              {pendingCount > 0 && (
                <span className="text-xs bg-amber-500 text-black font-black px-2 py-0.5 rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Review, approve and process user withdrawals</p>
          </div>
        </div>
        <button
          onClick={() => fetchWithdrawals(page, statusFilter, true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
              statusFilter === f.value
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="text-sm text-gray-500 mb-5">
        {total} request{total !== 1 ? 's' : ''} found
        {statusFilter && ` with status "${statusFilter}"`}
      </div>

      {/* Withdrawal rows */}
      <div className="space-y-3">
        {withdrawals.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            No withdrawal requests found.
          </div>
        ) : (
          withdrawals.map((w) => (
            <WithdrawalRow
              key={w.id}
              withdrawal={w}
              onAction={(w, action) => setModal({ withdrawal: w, action })}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm font-medium disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm font-medium disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Action Modal */}
      <AnimatePresence>
        {modal && (
          <ActionModal
            withdrawal={modal.withdrawal}
            action={modal.action}
            onClose={() => setModal(null)}
            onSuccess={() => fetchWithdrawals(page, statusFilter, true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
