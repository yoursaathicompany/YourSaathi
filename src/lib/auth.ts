import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import ResendProvider from 'next-auth/providers/resend';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from '@/lib/supabase/server';

// ── helpers ──────────────────────────────────────────────────────────────
async function getUserFromDB(userId: string) {
  const { data } = await supabaseAdmin
    .from('users')
    .select('id, display_name, avatar_url, role')
    .eq('id', userId)
    .single();
  return data;
}

// ── NextAuth config ───────────────────────────────────────────────────────
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // OAuth providers (configure in Supabase Dashboard too if using Supabase Auth)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    // Magic link (email OTP) — requires Resend API key or SMTP
    // Note: Email providers generally require a database adapter to store tokens.
    // Without an adapter, magic links may not work properly.
    // ResendProvider({
    //   apiKey: process.env.RESEND_API_KEY ?? '',
    //   from: process.env.EMAIL_FROM ?? 'QuizFlow <noreply@quizflow.dev>',
    // }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Use Supabase native auth to verify credentials using a temporary client
        const { createClient } = await import('@supabase/supabase-js');
        const tempClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'http://127.0.0.1:54321',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
          { auth: { persistSession: false, autoRefreshToken: false } }
        );

        const { data: authData, error: authErr } = await tempClient.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        if (authErr || !authData.user) return null;

        // Fetch additional profile data
        const { data: profile } = await supabaseAdmin
          .from('users')
          .select('id, display_name, avatar_url, role')
          .eq('id', authData.user.id)
          .single();

        return {
          id: authData.user.id,
          name: profile?.display_name || authData.user.user_metadata?.full_name,
          email: authData.user.email,
          image: profile?.avatar_url,
        };
      },
    }),
  ],

  debug: true,

  pages: {
    signIn: '/login',
    error: '/login',
    verifyRequest: '/login?verify=1',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        const email = user.email;
        if (!email) return false;

        // Check if user exists in public.users
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

        if (!existingUser) {
          // Create new user in public.users
          const newId = crypto.randomUUID();
          const { error } = await supabaseAdmin
            .from('users')
            .insert({
              id: newId,
              email: email,
              display_name: user.name || email.split('@')[0],
              avatar_url: user.image,
              role: 'student', 
              coins_balance: 0, 
            });

          if (error) {
            console.error('Error auto-creating user in public.users:', error);
            // We allow sign in to proceed, or return false to block
          }
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google' || account?.provider === 'github') {
          // Find the Supabase UUID by email since OAuth only gives us the provider ID
          const { data: dbUser } = await supabaseAdmin
            .from('users')
            .select('id, role, display_name, avatar_url')
            .eq('email', user.email)
            .single();

          if (dbUser) {
            token.userId = dbUser.id;
            token.role = dbUser.role;
            token.displayName = dbUser.display_name;
            token.avatarUrl = dbUser.avatar_url;
          } else {
            token.userId = user.id as string;
          }
        } else {
          // For credentials, user.id is already the Supabase UUID
          token.userId = user.id as string;
        }
      } else if (token.userId) {
        // Refresh DB data every time the JWT is refresh-checked
        const dbUser = await getUserFromDB(token.userId as string);
        if (dbUser) {
          token.role = dbUser.role;
          token.displayName = dbUser.display_name;
          token.avatarUrl = dbUser.avatar_url;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.userId as string;
        if (token.role) (session.user as any).role = token.role;
        if (token.displayName) (session.user as any).displayName = token.displayName;
        if (token.avatarUrl) (session.user as any).avatarUrl = token.avatarUrl;
      }
      return session;
    },
  },
});

// ── Extend next-auth types ────────────────────────────────────────────────
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      coinsBalance?: number;
      emailVerified?: boolean;
      displayName?: string | null;
      avatarUrl?: string | null;
    };
  }
}
