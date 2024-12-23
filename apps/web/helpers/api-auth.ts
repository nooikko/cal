import { auth } from '@/lib/auth';
import type { NextAuthRequest } from 'next-auth';

// biome-ignore lint/suspicious/noExplicitAny: Next expects the use of any in this case
type ApiAuth = (args_0: (req: NextAuthRequest, ctx: Promise<any>) => Promise<Response>) => (...args: any) => any;

/**
 * ! THIS FUNCTION IS A WORKAROUND FOR NEXT 15
 * ! READ THE COMMENT BEFORE EDITING THIS FUNCTION
 * ! OR ELSE
 * Wraps the auth function to ensure it returns a valid typed request and response.
 *
 * This should only be used server side on API routes.
 * ! DO NOT USE THIS FUNCTION CLIENT SIDE
 *
 * Ok, so this exists due to issues with NextAuth supporting Next 15 but not supporting the types of Next 15.
 * This type exists as the recommended type from Next 15 of what the returned function should be.
 * This was found out through trial and error and is not documented anywhere else than here.
 * Please talk to @qpenney (Quinn Penney) if you're thinking about changing this.
 */
export const apiAuth = auth as unknown as ApiAuth;
