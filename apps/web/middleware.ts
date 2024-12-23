import authConfig from '@/lib/auth.config';
import NextAuth from 'next-auth';
import type { NextMiddleware } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== '/login') {
    const newUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
}) as unknown as NextMiddleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|login|logout|error).*)'],
};
