import type { Organization } from '@prisma/client';
import type { Session as NextAuthSession } from 'next-auth';
import type { NextRequest } from 'next/server';

// Extend next-auth's Session interface to include the custom 'hmacSecret' field
declare module 'next-auth' {
  interface Session extends NextAuthSession {
    user?: {
      email?: string;
      name?: string;
      image?: string;
      sub: string;
    };
    organization: Pick<Organization, 'id' | 'type' | 'status'>;
  }

  // Ensure token has the correct type on NextAuthRequest for clarity
  interface NextAuthRequest extends NextRequest {
    auth: Session | null;
  }
}
