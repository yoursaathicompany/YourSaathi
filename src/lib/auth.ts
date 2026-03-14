import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Dummy Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "student or teacher" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Dummy implementation for demo purposes. In production use real Auth.
        if (credentials?.username === "teacher") {
          return { id: "00000000-0000-0000-0000-000000000000", name: "Seed Teacher Admin", email: "teacher@zquiz.com" };
        }
        return { id: "11111111-1111-1111-1111-111111111111", name: "Student Demo", email: "student@zquiz.com" };
      }
    })
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "http://127.0.0.1:54321",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "dummy",
  }),
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user?.id || session.user.id;
      }
      return session;
    }
  }
});
