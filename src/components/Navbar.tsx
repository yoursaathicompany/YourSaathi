'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Sparkles, LogOut, User, Settings, Shield, Menu, X, Coins, History, GraduationCap } from 'lucide-react';
import CoinWalletHeader from './CoinWalletHeader';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch live balance on mount & when session changes
  useEffect(() => {
    const fetchBalance = () => {
      fetch('/api/withdrawals/balance')
        .then(r => r.json())
        .then(d => setBalance(d.available_balance ?? 0))
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 border-white/5 bg-[#09090b]/80 bg-[#09090b]/80 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 group">
          <div className="w-8 h-8 rounded-xl bg-transparent flex items-center justify-center transition-transform group-hover:scale-110">
            <span className="font-black text-[28px] text-[#A855F7] leading-none">Y</span>
          </div>
          <span className="font-bold text-white text-white text-xl tracking-tight hidden sm:block">Saathi</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/pyq" className="hover:text-white transition-colors text-purple-400 flex items-center gap-1 font-semibold">
            <GraduationCap className="w-3.5 h-3.5" /> PYQ
          </Link>
          <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-1">
            Blog
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
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
                  onClick={() => setUserMenuOpen(o => !o)}
                  id="user-menu-btn"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
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
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      role="menu"
                    >
                      <Link href="/profile" role="menuitem" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <User className="w-4 h-4" /> Profile & Wallet
                      </Link>
                      <Link href="/history" role="menuitem" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <History className="w-4 h-4" /> Quiz History
                      </Link>
                      <Link href="/redeem" role="menuitem" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-yellow-500/5 transition-colors">
                        <Coins className="w-4 h-4" /> Redeem Coins
                      </Link>
                      <Link href="/settings" role="menuitem" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" role="menuitem" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-indigo-400 hover:bg-white/5 transition-colors">
                          <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-white/5" />
                      <button
                        onClick={() => { signOut({ callbackUrl: '/login' }); setUserMenuOpen(false); }}
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
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 border-white/5 bg-white/95 bg-[#09090b]/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-4 text-sm font-medium text-gray-600 text-gray-300">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-white hover:text-white transition-colors">Home</Link>
              <Link href="/pyq" onClick={() => setMobileMenuOpen(false)} className="text-purple-400 font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> PYQ Practice
              </Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-pink-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Blog
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-white hover:text-white transition-colors">About</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-white hover:text-white transition-colors">Contact</Link>

              {session && (
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="hover:text-white hover:text-white transition-colors">
                  Profile
                </Link>
              )}
              {session && (
                <Link href="/redeem" onClick={() => setMobileMenuOpen(false)} className="text-yellow-600 text-yellow-400 flex items-center gap-1">
                  <Coins className="w-4 h-4" /> Redeem
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-indigo-600 text-indigo-400 flex items-center gap-1">
                  <Shield className="w-4 h-4" /> Admin
                </Link>
              )}
              {status === 'unauthenticated' && (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-purple-600 font-semibold mt-2">
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
