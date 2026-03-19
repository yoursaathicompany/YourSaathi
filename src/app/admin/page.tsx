'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  BookOpen, 
  BrainCircuit, 
  LineChart, 
  Plus, 
  Minus, 
  Search, 
  Loader2,
  AlertCircle,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, quizzes: 0, generations: 0, avgScore: '0%' });
  const [query, setQuery] = useState('');
  const [targetUser, setTargetUser] = useState<any>(null);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    // Fill with some mock stats for now, in real app fetch from /api/admin/stats
    setTimeout(() => {
      setStats({ users: 1242, quizzes: 84, generations: 329, avgScore: '72%' });
      setLoading(false);
    }, 800);
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    // Real app: fetch('/api/admin/users?email=' + query)
    setTimeout(() => {
      setTargetUser({
        id: '123-abc',
        email: query,
        display_name: 'Search Result User',
        coins_balance: 450
      });
      setLoading(false);
    }, 500);
  };

  const adjustBalance = async () => {
    if (!targetUser || adjustAmount === 0) return;
    setAdjusting(true);
    try {
      const res = await fetch('/api/admin/adjust-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_user_id: targetUser.id,
          amount: adjustAmount,
          reason: 'Manual adjustment'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTargetUser({ ...targetUser, coins_balance: data.new_balance });
        setAdjustAmount(0);
        alert('Balance updated successfully!');
      }
    } catch (e) {
      alert('Failed to update balance');
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Manage users, adjust balances, and monitor AI activity.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
             <input 
               type="text" 
               placeholder="Search user email..." 
               value={query}
               onChange={e => setQuery(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSearch()}
               className="bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64"
             />
           </div>
           <button onClick={handleSearch} className="bg-white text-black text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
             Search
           </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-400' },
          { label: 'Quizzes', value: stats.quizzes, icon: BookOpen, color: 'text-green-400' },
          { label: 'AI Gens', value: stats.generations, icon: BrainCircuit, color: 'text-purple-400' },
          { label: 'Avg Score', value: stats.avgScore, icon: LineChart, color: 'text-rose-400' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Balance Adjustment Area */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {targetUser && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-indigo-500/5"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-white">{targetUser.display_name}</h3>
                    <p className="text-sm text-gray-500">{targetUser.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Current Balance</p>
                    <div className="flex items-center gap-2 text-3xl font-black text-yellow-400">
                      <Coins className="w-6 h-6" /> {targetUser.coins_balance}
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                  <p className="text-sm font-bold mb-4">Adjust Coin Balance</p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setAdjustAmount(a => a - 10)}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    
                    <input 
                      type="number" 
                      value={adjustAmount}
                      onChange={e => setAdjustAmount(parseInt(e.target.value) || 0)}
                      className="flex-1 bg-transparent text-center text-4xl font-bold focus:outline-none"
                    />

                    <button 
                      onClick={() => setAdjustAmount(a => a + 10)}
                      className="p-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => setAdjustAmount(0)}
                       className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors"
                     >
                       Clear
                     </button>
                     <button 
                       onClick={adjustBalance}
                       disabled={adjusting || adjustAmount === 0}
                       className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                     >
                       {adjusting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Adjustment'}
                     </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            </div>
          )}

          {!targetUser && !loading && (
            <div className="glass-panel p-20 rounded-3xl border border-white/5 text-center flex flex-col items-center">
              <Users className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-500 max-w-xs mx-auto">Search for a user by email to view their stats and adjust their coin balance.</p>
            </div>
          )}
        </div>

        {/* System Health / Recent Log Stubs */}
        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-2xl border border-white/10">
             <h4 className="text-sm font-bold mb-4 uppercase text-gray-500">System Logs</h4>
             <div className="space-y-3">
                <div className="text-xs p-3 bg-green-500/5 border border-green-500/10 rounded-lg text-green-400">
                  [19:54] AI Generation Success: topic="React"
                </div>
                <div className="text-xs p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-blue-400">
                  [19:52] User Signup: test@example.com
                </div>
                <div className="text-xs p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg text-yellow-400">
                  [19:48] Coin Award: +15 coins to 0x429
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
