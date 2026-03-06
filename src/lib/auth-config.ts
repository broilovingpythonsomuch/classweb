import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { verifyPassword } from "./crypto";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      avatar?: string | null;
      emailVerified: boolean;
    };
  }
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    emailVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    emailVerified: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Normalize email to lowercase
        const email = credentials.email.toLowerCase().trim();

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Use constant-time comparison to prevent timing attacks
          verifyPassword("dummy-password", "dummy:hash");
          return null;
        }

        const passwordMatch = verifyPassword(credentials.password, user.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.avatar = user.avatar;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || generateFallbackSecret(),
};

// Generate a fallback secret for development only
function generateFallbackSecret(): string {
  // This should only be used in development
  // In production, always use NEXTAUTH_SECRET environment variable
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "WARNING: NEXTAUTH_SECRET is not set in production. Please set it in your environment variables."
    );
  }
  return "classhub-dev-secret-key-change-in-production-" + Date.now();
}
