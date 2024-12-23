import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { auth, signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

interface LoginProps {
  readonly searchParams: Promise<{
    readonly callbackUrl: string;
  }>;
}

export default async function Login({ searchParams }: LoginProps) {
  const callbackUrl = (await searchParams)?.callbackUrl || '/';
  const user = await auth();

  if (user) {
    if (callbackUrl) {
      redirect(callbackUrl);
    } else {
      redirect('/');
    }
  }

  return (
    <div className='flex items-center justify-center w-screen h-screen'>
      <Card className='w-96 border-transparent'>
        <CardHeader className='text-2xl text-center'>Welcome Back</CardHeader>
        <CardContent>
          <form
            autoComplete='new-password'
            className='space-y-3'
            action={async () => {
              'use server';

              try {
                await signIn('github');
              } catch (error) {
                if (error instanceof AuthError) {
                  console.info(error);
                }
                throw error;
              }
            }}
          >
            <input type='hidden' name='callbackUrl' value={callbackUrl} />
            <Button variant='secondary' size='lg' className='w-full' type='submit' name='loginType' value='github'>
              Continue with GitHub
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
