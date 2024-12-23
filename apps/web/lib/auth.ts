import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { error } from '@repo/logger';
import * as argon2 from 'argon2';
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
      authorize: async (credentials) => {
        const { email, password } = credentials as { email: string; password: string };
        const user = await prisma.user.findFirst({ where: { email } });

        if (!user || !user.password) {
          error('Invalid credentials', {
            err: new Error('Invalid credentials'),
            email,
          });
          throw new Error('Invalid credentials');
        }

        const valid = await argon2.verify(user.password, password);
        if (!valid) {
          error('Invalid credentials (password mismatch)', {
            err: new Error('Invalid credentials (password mismatch)'),
            email,
          });
          throw new Error('Invalid credentials');
        }

        return user;
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

      const userOrganization = await prisma.user.findUnique({
        where: { id: session.user.sub },
        select: { organization: { select: { id: true, type: true, status: true } } },
      });

      if (!userOrganization?.organization) {
        error('User organization not found', {
          err: new Error('User organization not found'),
          id: userOrganization?.organization?.id,
        });

        throw new Error('User organization not found');
      }

      session.organization = userOrganization.organization;
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
