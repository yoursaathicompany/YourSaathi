'use client';

import { useState, useEffect } from 'react';
import { Users, ArrowLeft, Loader2, Coins, History, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users/all');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error('Failed to load users', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 glass-panel hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              Registered Users
            </h1>
            <p className="text-gray-400 mt-1">View all user details, coin balances, and quiz history.</p>
          </div>
        </div>
        <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
           <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total</span>
           <span className="text-white font-black text-xl">{users.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel border border-white/10 overflow-hidden rounded-2xl"
            >
              <div 
                className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden bg-gray-800 shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.display_name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500 bg-gray-900 border border-white/5">
                        {user.display_name ? user.display_name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       {user.display_name || 'Anonymous User'} 
                       {user.role === 'admin' && <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Admin</span>}
                    </h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 md:ml-auto">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Joined</p>
                    <p className="text-sm font-medium text-gray-300">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-yellow-500/70 uppercase font-bold tracking-wider">Coins Balance</p>
                    <div className="flex items-center gap-1 text-xl font-black text-yellow-400">
                      <Coins className="w-5 h-5" /> {user.coins_balance || 0}
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedUser === user.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 bg-black/40"
                  >
                    <div className="p-6">
                      <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                        <History className="w-4 h-4" /> Quiz History ({user.attempts?.length || 0})
                      </h4>
                      
                      {user.attempts && user.attempts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {user.attempts.map((attempt: any) => (
                            <div key={attempt.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
                              <h5 className="font-bold text-white mb-1 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                                <span className="line-clamp-1">{attempt.quizzes?.title || 'Unknown Quiz'}</span>
                              </h5>
                              <p className="text-xs text-gray-400 mb-3 ml-6 line-clamp-1">{attempt.quizzes?.topic || 'General Topic'}</p>
                              
                              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                                <span className="text-[11px] text-gray-500 font-medium">
                                  {new Date(attempt.created_at).toLocaleDateString()}
                                </span>
                                <span className={`text-sm font-black ${Number(attempt.score_percentage) >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                                  {Math.round(Number(attempt.score_percentage))}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 border border-dashed border-white/10 rounded-xl text-center">
                           <FileText className="w-8 h-8 text-gray-600 mb-2" />
                           <p className="text-sm font-medium text-gray-400">No quizzes taken yet.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          
          {users.length === 0 && !loading && (
             <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 flex flex-col items-center">
               <Users className="w-12 h-12 text-gray-600 mb-4" />
               <p className="text-gray-400">No registered users found.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
