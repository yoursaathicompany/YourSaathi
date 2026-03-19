'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Bell,
  Zap,
  Volume2,
  Eye,
  Lock,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySent, setVerifySent] = useState(false);

  useEffect(() => {
    async function checkVerification() {
      try {
        const res = await fetch('/api/auth/verify-email');
        if (res.ok) {
          const data = await res.json();
          setIsVerified(data.verified);
        }
      } catch (err) {
        console.error('Failed to fetch verification status', err);
      }
    }
    if (session?.user?.email) {
      checkVerification();
    }
  }, [session]);

  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-email', { method: 'POST' });
      if (res.ok) {
        setVerifySent(true);
      } else {
        alert("Failed to send verification email. Please try again later.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Animation & Sound preferences (saved to local storage)
  const [prefs, setPrefs] = useState({
    animations: true,
    sounds: true,
    reducedMotion: false,
    notifications: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('quizflow_prefs');
    if (saved) setPrefs(JSON.parse(saved));
  }, []);

  const togglePref = (key: keyof typeof prefs) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    localStorage.setItem('quizflow_prefs', JSON.stringify(newPrefs));
  };

  const handleSave = () => {
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  if (status === 'loading') return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-purple-600/20 rounded-2xl border border-purple-500/20">
          <SettingsIcon className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your account preferences and app behavior.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Account Details */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl border border-white/10"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400">
              {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
            Account Details
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white text-lg">{session?.user?.name || 'User'}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-gray-400">{session?.user?.email}</p>
                  
                  {isVerified === true && (
                    <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                  {isVerified === false && !verifySent && (
                    <button 
                      onClick={handleVerifyEmail}
                      disabled={isVerifying}
                      className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/20 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 active:scale-95"
                    >
                      {isVerifying && <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                      Verify Email
                    </button>
                  )}
                  {isVerified === false && verifySent && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium animate-pulse flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verification Link Sent!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appearance & Accessibility */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl border border-white/10"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Experience & Accessibility
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Enable Animations</p>
                <p className="text-xs text-gray-500">Smooth transitions and UI motions.</p>
              </div>
              <button
                onClick={() => togglePref('animations')}
                className={`w-12 h-6 rounded-full transition-colors relative ${prefs.animations ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prefs.animations ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between text-gray-400 hover:text-white transition-colors cursor-pointer group">
              <div>
                <p className="font-medium">Reduced Motion</p>
                <p className="text-xs text-gray-500">Disables flying coins and heavy transitions.</p>
              </div>
              <button
                onClick={() => togglePref('reducedMotion')}
                className={`w-12 h-6 rounded-full transition-colors relative ${prefs.reducedMotion ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prefs.reducedMotion ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound Effects</p>
                <p className="text-xs text-gray-500">Play subtle sounds during success/reward.</p>
              </div>
              <button
                onClick={() => togglePref('sounds')}
                className={`w-12 h-6 rounded-full transition-colors relative ${prefs.sounds ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prefs.sounds ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security / Account */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-3xl border border-white/10"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            Security & Privacy
          </h2>

          <div className="space-y-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Automatic Backups</p>
                <p className="text-xs text-gray-500">Your quiz history and coin balance are safely synced with YourSaathi database.</p>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-sm text-gray-500">DANGER ZONE</p>
              <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 font-medium transition-colors">
                <Trash2 className="w-4 h-4" /> Reset My Coin Balance
              </button>
              <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400 font-medium transition-colors">
                <Trash2 className="w-4 h-4" /> Delete My Account
              </button>
            </div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50"
          >
            {saveLoading ? <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" /> : <Save className="w-4 h-4" />}
            {success ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-[100]"
          >
            <CheckCircle2 className="w-5 h-5" />
            Settings saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
