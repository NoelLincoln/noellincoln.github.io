import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// Refresh the Django token 5 minutes before its 1-hour expiry.
// This ensures we never send an expired token to the API.
const ACCESS_TOKEN_TTL = 55 * 60 * 1000;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: token.refreshToken }),
    });
    if (!res.ok) throw new Error("Refresh failed");
    const tokens = await res.json();
    return {
      ...token,
      accessToken: tokens.access,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });
        if (!res.ok) return null;
        const tokens = await res.json();
        return {
          id: credentials.username as string,
          name: credentials.username as string,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          isStaff: tokens.is_staff ?? false,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Google sign-in — exchange Google identity for a Django JWT
      if (account?.provider === "google" && user) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/social/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, name: user.name }),
        });
        if (res.ok) {
          const tokens = await res.json();
          return {
            ...token,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL,
            isStaff: tokens.is_staff ?? false,
          };
        }
      }

      // Credentials sign-in — tokens already on the user object
      if (user) {
        return {
          ...token,
          accessToken: (user as { accessToken?: string }).accessToken,
          refreshToken: (user as { refreshToken?: string }).refreshToken,
          accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL,
          isStaff: (user as { isStaff?: boolean }).isStaff ?? false,
        };
      }

      // Token still valid — return as-is
      if (Date.now() < (token.accessTokenExpires ?? 0)) {
        return token;
      }

      // Token expired — refresh it (isStaff is preserved via spread)
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.isStaff = token.isStaff ?? false;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
