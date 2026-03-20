'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Sparkles, LogOut, User, Settings, Shield, Menu, X, Coins } from 'lucide-react';
import CoinWalletHeader from './CoinWalletHeader';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch live balance on mount & when session changes
  useEffect(() => {
    const fetchBalance = () => {
      fetch('/api/user/balance')
        .then(r => r.json())
        .then(d => setBalance(d.coins_balance ?? 0))
        .catch(() => { });
    };

    if (status === 'authenticated') {
      fetchBalance();
    }

    // Listen for custom event to update balance without reload
    const handleCoinUpdate = () => fetchBalance();
    window.addEventListener('coinBalanceUpdate', handleCoinUpdate);
    return () => window.removeEventListener('coinBalanceUpdate', handleCoinUpdate);
  }, [status]);

  const isAdmin = (session?.user as any)?.role === 'admin' || (session?.user as any)?.role === 'teacher';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 group">
          <div className="w-8 h-8 rounded-xl bg-transparent flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="font-black text-[28px] text-[#A855F7] leading-none">Y</span>
          </div>
          <span className="font-bold text-white text-xl tracking-tight hidden sm:block">Saathi</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          {session && <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>}
          {session && (
            <Link href="/redeem" className="hover:text-white transition-colors text-yellow-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> Redeem
            </Link>
          )}
          {isAdmin && <Link href="/admin" className="hover:text-white transition-colors text-indigo-400">Admin</Link>}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {status === 'authenticated' && session?.user ? (
            <>
              <CoinWalletHeader balance={balance} />

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  id="user-menu-btn"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name ?? 'User'} className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                      {(session.user.name ?? session.user.email ?? 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm text-gray-300 max-w-[100px] truncate">
                    {session.user.name ?? session.user.email}
                  </span>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      role="menu"
                    >
                      <Link href="/profile" role="menuitem" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <User className="w-4 h-4" /> Profile & Wallet
                      </Link>
                      <Link href="/redeem" role="menuitem" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-yellow-500/5 transition-colors">
                        <Coins className="w-4 h-4" /> Redeem Coins
                      </Link>
                      <Link href="/settings" role="menuitem" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" role="menuitem" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-indigo-400 hover:bg-white/5 transition-colors">
                          <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-white/5" />
                      <button
                        onClick={() => { signOut({ callbackUrl: '/login' }); setMenuOpen(false); }}
                        role="menuitem"
                        id="btn-signout"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : status === 'unauthenticated' ? (
            <Link
              href="/login"
              id="btn-signin-nav"
              className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-purple-500/20"
            >
              Sign In
            </Link>
          ) : null}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
