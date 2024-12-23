'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className='w-full h-full flex items-center flex-col justify-center space-y-5'>
      <div className='text-xl'>Page not found.</div>
      <Link href='/overview'>
        <Button>Return to Overview</Button>
      </Link>
    </div>
  );
}
