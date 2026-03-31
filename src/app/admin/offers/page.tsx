/* eslint-disable */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Tag, Sparkles, Users, Coins, Calendar, AlertCircle,
  Loader2, X, ChevronLeft, CheckCircle2, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Offer {
  id: string;
  name: string;
  type: 'signup_bonus' | 'promo_code' | 'custom';
  coin_amount: number;
  max_recipients: number | null;
  is_active: boolean;
  promo_code: string | null;
  starts_at: string | null;
  ends_at: string | null;
  description: string | null;
  modal_title: string | null;
  modal_body: string | null;
  created_at: string;
  claims_count: number;
  remaining: number | null;
}

type OfferType = 'signup_bonus' | 'promo_code' | 'custom';

interface FormData {
  name: string;
  type: OfferType;
  coin_amount: number;
  max_recipients: string;   // string so input works, convert on submit
  is_active: boolean;
  promo_code: string;
  starts_at: string;
  ends_at: string;
  description: string;
  modal_title: string;
  modal_body: string;
}

const DEFAULT_FORM: FormData = {
  name: '',
  type: 'custom',
  coin_amount: 50,
  max_recipients: '',
  is_active: true,
  promo_code: '',
  starts_at: '',
  ends_at: '',
  description: '',
  modal_title: '',
  modal_body: '',
};

// ── Badge helpers ─────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: OfferType }) {
  const cfg = {
    signup_bonus: { label: 'Signup', color: 'text-blue-400', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', icon: '🎁' },
    promo_code:   { label: 'Promo Code', color: 'text-purple-400', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', icon: '🏷️' },
    custom:        { label: 'Custom', color: 'text-emerald-400', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)', icon: '✨' },
  }[type];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

function StatusBadge({ offer }: { offer: Offer }) {
  const now = new Date();
  if (!offer.is_active) return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/10 border border-gray-500/20 text-gray-400">Paused</span>
  );
  if (offer.starts_at && new Date(offer.starts_at) > now) return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">Upcoming</span>
  );
  if (offer.ends_at && new Date(offer.ends_at) < now) return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400">Expired</span>
  );
  if (offer.max_recipients != null && offer.claims_count >= offer.max_recipients) return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/20 text-orange-400">Full</span>
  );
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
    </span>
  );
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Offer Form Modal ──────────────────────────────────────────────────────────
function OfferFormModal({
  initial,
  onSave,
  onClose,
  saving,
  error,
}: {
  initial?: Offer | null;
  onSave: (data: FormData) => void;
  onClose: () => void;
  saving: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<FormData>(
    initial
      ? {
          name: initial.name,
          type: initial.type,
          coin_amount: initial.coin_amount,
          max_recipients: initial.max_recipients?.toString() ?? '',
          is_active: initial.is_active,
          promo_code: initial.promo_code ?? '',
          starts_at: initial.starts_at ? initial.starts_at.slice(0, 16) : '',
          ends_at: initial.ends_at ? initial.ends_at.slice(0, 16) : '',
          description: initial.description ?? '',
          modal_title: initial.modal_title ?? '',
          modal_body: initial.modal_body ?? '',
        }
      : DEFAULT_FORM
  );

  const set = (key: keyof FormData, val: any) => setForm(f => ({ ...f, [key]: val }));

  return (
    <AnimatePresence>
      <>
        <motion.div
          className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8"
            style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>

            <h2 className="text-2xl font-extrabold text-white mb-6">
              {initial ? 'Edit Offer' : 'Create New Offer'}
            </h2>

            <div className="space-y-5">
              {/* Row 1: Name & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Offer Name *</label>
                  <input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Summer Bonus"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Type *</label>
                  <select
                    value={form.type}
                    onChange={e => set('type', e.target.value as OfferType)}
                    disabled={!!initial}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
                  >
                    <option value="signup_bonus">Signup Bonus (auto-shown on login)</option>
                    <option value="promo_code">Promo Code (user enters code)</option>
                    <option value="custom">Custom (auto-shown popup)</option>
                  </select>
                </div>
              </div>

              {/* Promo code field */}
              {form.type === 'promo_code' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Promo Code *</label>
                  <input
                    value={form.promo_code}
                    onChange={e => set('promo_code', e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER2026"
                    maxLength={32}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono tracking-widest placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Users enter this code in their profile to claim coins.</p>
                </div>
              )}

              {/* Row 2: Coins & Max recipients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Coin Amount *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.coin_amount}
                    onChange={e => set('coin_amount', parseInt(e.target.value) || 1)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Max Recipients</label>
                  <input
                    type="number"
                    min={1}
                    value={form.max_recipients}
                    onChange={e => set('max_recipients', e.target.value)}
                    placeholder="Unlimited"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              {/* Row 3: Date range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Start Date</label>
                  <input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={e => set('starts_at', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">End Date</label>
                  <input
                    type="datetime-local"
                    value={form.ends_at}
                    onChange={e => set('ends_at', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              {/* Modal texts */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Modal Headline (shown to users)</label>
                <input
                  value={form.modal_title}
                  onChange={e => set('modal_title', e.target.value)}
                  placeholder={`e.g. 🎁 ${form.name || 'Special Offer'}!`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Modal Body Text (shown to users)</label>
                <textarea
                  rows={3}
                  value={form.modal_body}
                  onChange={e => set('modal_body', e.target.value)}
                  placeholder="Describe the offer to users..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>

              {/* Internal notes */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Admin Notes (internal)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Optional internal notes..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-sm font-semibold text-white">Active</p>
                  <p className="text-xs text-gray-500">Offer is live and claimable by users</p>
                </div>
                <button
                  onClick={() => set('is_active', !form.is_active)}
                  className="transition-colors"
                >
                  {form.is_active
                    ? <ToggleRight className="w-8 h-8 text-green-400" />
                    : <ToggleLeft className="w-8 h-8 text-gray-600" />
                  }
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSave(form)}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Offer'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

// ── Delete confirm dialog ─────────────────────────────────────────────────────
function DeleteDialog({ offer, onConfirm, onCancel, deleting }: {
  offer: Offer; onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  return (
    <AnimatePresence>
      <>
        <motion.div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} />
        <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
          <div className="w-full max-w-sm rounded-3xl p-8" style={{ background: '#0f0f1a', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Delete Offer?</h3>
            <p className="text-sm text-gray-400 text-center mb-6">
              <span className="text-white font-semibold">{offer.name}</span> will be permanently deleted along with its {offer.claims_count} claim record{offer.claims_count !== 1 ? 's' : ''}. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
              <button onClick={onConfirm} disabled={deleting} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Offer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/offers');
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setOffers(data.offers ?? []);
    } catch {
      toast('Failed to load offers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  // Toggle active
  const toggleActive = async (offer: Offer) => {
    const updated = { ...offer, is_active: !offer.is_active };
    setOffers(prev => prev.map(o => o.id === offer.id ? updated : o));
    const res = await fetch(`/api/admin/offers/${offer.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !offer.is_active }),
    });
    if (!res.ok) {
      setOffers(prev => prev.map(o => o.id === offer.id ? offer : o)); // revert
      toast('Failed to update offer');
    } else {
      toast(updated.is_active ? 'Offer activated ✓' : 'Offer paused ✓');
    }
  };

  // Save (create or update)
  const handleSave = async (form: FormData) => {
    setFormError(null);
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      type: form.type,
      coin_amount: Number(form.coin_amount),
      max_recipients: form.max_recipients ? Number(form.max_recipients) : null,
      is_active: form.is_active,
      promo_code: form.promo_code.trim() || null,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
      description: form.description.trim() || null,
      modal_title: form.modal_title.trim() || null,
      modal_body: form.modal_body.trim() || null,
    };

    if (!payload.name) { setFormError('Offer name is required'); setSaving(false); return; }
    if (payload.coin_amount < 1) { setFormError('Coin amount must be at least 1'); setSaving(false); return; }
    if (form.type === 'promo_code' && !payload.promo_code) { setFormError('Promo code is required'); setSaving(false); return; }
    if (payload.starts_at && payload.ends_at && new Date(payload.starts_at) >= new Date(payload.ends_at)) {
      setFormError('Start date must be before end date'); setSaving(false); return;
    }

    const url = editTarget ? `/api/admin/offers/${editTarget.id}` : '/api/admin/offers';
    const method = editTarget ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? 'Failed to save offer');
      } else {
        setFormOpen(false);
        setEditTarget(null);
        toast(editTarget ? 'Offer updated ✓' : 'Offer created ✓');
        fetchOffers();
      }
    } catch {
      setFormError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/offers/${deleteTarget.id}`, { method: 'DELETE' });
    if (res.ok) {
      setOffers(prev => prev.filter(o => o.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast('Offer deleted ✓');
    } else {
      toast('Failed to delete offer');
    }
    setDeleting(false);
  };

  const activeCount = offers.filter(o => o.is_active).length;
  const totalClaims = offers.reduce((s, o) => s + o.claims_count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            className="fixed top-6 right-6 z-[10000] flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-2xl"
            style={{ background: 'rgba(30,30,46,0.97)', border: '1px solid rgba(255,255,255,0.12)' }}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <Link href="/admin" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-4 transition-colors w-fit">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Admin
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Gift className="w-8 h-8 text-yellow-400" />
              Offers & Bonuses
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Create and manage coin offers, promo codes, and user bonuses.</p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setFormError(null); setFormOpen(true); }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-black transition-all"
            style={{ background: 'linear-gradient(135deg, #facc15 0%, #fb923c 100%)', boxShadow: '0 4px 20px rgba(250,204,21,0.3)' }}
          >
            <Plus className="w-4 h-4" />
            New Offer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Offers', value: offers.length, icon: Gift, color: 'text-indigo-400' },
          { label: 'Active', value: activeCount, icon: Sparkles, color: 'text-green-400' },
          { label: 'Total Claims', value: totalClaims, icon: Users, color: 'text-yellow-400' },
          { label: 'Paused / Expired', value: offers.length - activeCount, icon: Calendar, color: 'text-gray-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-panel p-5 rounded-2xl border border-white/10">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className="text-2xl font-extrabold text-white">{value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Offers list */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-3xl border border-white/5">
          <Gift className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-semibold">No offers yet</p>
          <p className="text-gray-600 text-sm mt-1">Click "New Offer" to create your first bonus offer.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                {/* Left: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white truncate">{offer.name}</h3>
                    <TypeBadge type={offer.type} />
                    <StatusBadge offer={offer} />
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">+{offer.coin_amount}</span> coins
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {offer.claims_count} claimed
                      {offer.max_recipients != null && (
                        <span> / {offer.max_recipients} max</span>
                      )}
                    </span>
                    {offer.promo_code && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-purple-400" />
                        <code className="font-mono text-purple-300">{offer.promo_code}</code>
                      </span>
                    )}
                    {(offer.starts_at || offer.ends_at) && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {fmtDate(offer.starts_at)} → {fmtDate(offer.ends_at)}
                      </span>
                    )}
                  </div>

                  {/* Cap progress bar */}
                  {offer.max_recipients != null && (
                    <div className="mt-3 max-w-xs">
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (offer.claims_count / offer.max_recipients) * 100)}%`,
                            background: offer.claims_count >= offer.max_recipients
                              ? '#ef4444'
                              : 'linear-gradient(90deg, #facc15, #fb923c)',
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        {offer.remaining != null ? `${offer.remaining} slots remaining` : 'No cap'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleActive(offer)}
                    title={offer.is_active ? 'Pause offer' : 'Activate offer'}
                    className="p-2.5 rounded-xl transition-colors hover:bg-white/10"
                  >
                    {offer.is_active
                      ? <ToggleRight className="w-6 h-6 text-green-400" />
                      : <ToggleLeft className="w-6 h-6 text-gray-600" />
                    }
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => { setEditTarget(offer); setFormError(null); setFormOpen(true); }}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit offer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(offer)}
                    className="p-2.5 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete offer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      {formOpen && (
        <OfferFormModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
          saving={saving}
          error={formError}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          offer={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
