'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Chrome, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

type Mode = 'login' | 'signup' | 'magic';

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const verifyPending = params?.get('verify') === '1';
  const callbackUrl = params?.get('callbackUrl') || '/';

  useEffect(() => {
    if (status === 'authenticated') router.push(callbackUrl);
  }, [status, router, callbackUrl]);

  const handleOAuth = async (provider: 'google' | 'github') => {
    setLoading(provider);
    setError(null);
    await signIn(provider, { callbackUrl });
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('magic');
    setError(null);
    const res = await signIn('resend', { email, redirect: false, callbackUrl });
    setLoading(null);
    if (res?.error) {
      setError('Could not send magic link. Check the email and try again.');
    } else {
      setMagicSent(true);
    }
  };

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('credentials');
    setError(null);

    try {
      if (mode === 'signup') {
        const createRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });

        const data = await createRes.json();
        if (!createRes.ok) {
          throw new Error(data.error || 'Failed to create account');
        }
      }

      // Proceed to sign in
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        throw new Error(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error);
      } else if (res?.ok) {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#09090b]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mb-4">
            {/* <Sparkles className="w-5 h-5 text-purple-400" /> */}
            <span className="font-bold text-white text-lg tracking-tight">YourSaathi</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            {mode === 'signup' ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {mode === 'signup' ? 'Sign up to start learning' : 'Sign in to keep learning'}
          </p>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">

          {/* Verify notice */}
          {verifyPending && (
            <div className="mb-6 flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Check your email for a sign-in link. After clicking it you'll be logged in automatically.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth('google')}
              disabled={!!loading}
              id="btn-google"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 shadow-md"
            >
              {loading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Chrome className="w-5 h-5" />
              )}
              Continue with Google
            </button>
            <button
              onClick={() => handleOAuth('github')}
              disabled={!!loading}
              id="btn-github"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1f2937] text-white font-semibold rounded-xl hover:bg-[#374151] transition-all disabled:opacity-50 border border-white/10 shadow-md"
            >
              {loading === 'github' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Mode tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-5">
            {(['login', 'signup', 'magic'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setMagicSent(false); }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${mode === m
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                {m === 'login' ? 'Sign In' : m === 'signup' ? 'Sign Up' : 'Magic Link'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Magic Link */}
            {mode === 'magic' && (
              <motion.div key="magic" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                {magicSent ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-white font-semibold mb-1">Check your inbox!</p>
                    <p className="text-sm text-gray-400">We sent a magic link to <strong className="text-white">{email}</strong></p>
                    <button onClick={() => setMagicSent(false)} className="mt-4 text-xs text-purple-400 hover:underline">
                      Try a different email
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          id="magic-email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={!!loading}
                      id="btn-magic-submit"
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading === 'magic' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      Send Magic Link
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* Email/Password Credentials */}
            {(mode === 'login' || mode === 'signup') && (
              <motion.div key="cred" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                <form onSubmit={handleCredentialsAuth} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-gray-300">Name</label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="John Doe"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-gray-300">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!!loading}
                    id="btn-cred-submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading === 'credentials' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          By continuing you agree to our Terms & Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

