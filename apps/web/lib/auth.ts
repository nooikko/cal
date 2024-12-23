import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import authConfig from './auth.config';

const prisma = new PrismaClient();

const options: NextAuthConfig = {
  ...authConfig,
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    }),
    ...authConfig.providers,
  ],
  callbacks: {
    async authorized({ auth }) {
      return !!auth?.user;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.sub = token.sub;
      }

      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
};

const nextAuth = NextAuth(options);

type NextAuthReturnType = ReturnType<typeof NextAuth>;

export const auth: NextAuthReturnType['auth'] = nextAuth.auth;
export const handlers: NextAuthReturnType['handlers'] = nextAuth.handlers;
export const signIn: NextAuthReturnType['signIn'] = nextAuth.signIn;
export const signOut: NextAuthReturnType['signOut'] = nextAuth.signOut;
