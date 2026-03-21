'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Coins, Wallet, History, Verified, AlertCircle } from 'lucide-react';
import CoinTransactionList from '@/components/CoinTransactionList';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number | null>(null);
  const [stats, setStats] = useState<{ memberSince: string | null; quizzesTaken: number }>({
    memberSince: null,
    quizzesTaken: 0,
  });

  useEffect(() => {
    const fetchBalance = () => {
      fetch('/api/user/balance')
        .then(r => r.json())
        .then(d => setBalance(d.coins_balance))
        .catch(() => { });
    };

    const fetchStats = () => {
      fetch('/api/user/stats')
        .then(r => r.json())
        .then(d => {
          if (d.memberSince !== undefined) {
            setStats({ memberSince: d.memberSince, quizzesTaken: d.quizzesTaken });
          }
        })
        .catch(() => { });
    };

    if (status === 'authenticated') {
      fetchBalance();
      fetchStats();
    }

    const handleCoinUpdate = () => fetchBalance();
    window.addEventListener('coinBalanceUpdate', handleCoinUpdate);
    return () => window.removeEventListener('coinBalanceUpdate', handleCoinUpdate);
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 animate-spin border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-8 glass-panel rounded-3xl border border-white/10 max-w-sm">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Sign in Required</h2>
          <p className="text-gray-400 mb-6 text-sm">You need to be signed in to view your profile and coin wallet.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-500 transition-colors"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <User className="w-24 h-24" />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-xl shadow-purple-500/20">
                {user?.image ? (
                  <img src={user.image} alt={user.name || ''} className="w-full h-full rounded-full object-cover" />
                ) : (
                  (user?.name || user?.email || 'U')[0].toUpperCase()
                )}
              </div>

              <h1 className="text-2xl font-bold text-white mb-1">{user?.name || 'User'}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400 flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-indigo-400" />
                  {(user as any)?.role?.toUpperCase() || 'STUDENT'}
                </span>
                {(user as any)?.emailVerified && (
                  <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-400 flex items-center gap-1.5">
                    <Verified className="w-3 h-3" />
                    VERIFIED
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Member Since</span>
                <span className="text-sm text-black">
                  {stats.memberSince
                    ? new Date(stats.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                    : 'Loading...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">Quizzes Taken</span>
                <span className="text-sm text-black">{stats.quizzesTaken}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Wallet Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-3xl shadow-xl shadow-yellow-500/20 text-gray-900 group relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <Coins className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-gray-900/60" />
                <span className="text-sm font-bold uppercase tracking-wider text-gray-900/60">Current Balance</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tighter tabular-nums">
                  {balance == null ? '...' : (balance ?? 0).toLocaleString()}
                </span>
                <span className="text-xl font-bold opacity-70">coins</span>
              </div>

              <button className="mt-6 w-full bg-black/10 hover:bg-black/20 text-gray-900 font-bold py-3 rounded-2xl transition-all border border-black/5 text-sm">
                <Link href="/redeem"> Redeem Rewards </Link>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-3xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                Coin History
              </h2>
            </div>

            <CoinTransactionList />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
