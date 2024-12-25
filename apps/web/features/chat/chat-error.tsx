import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type React from 'react';

interface ChatErrorProps {
  message: string;
}

export const ChatError: React.FC<ChatErrorProps> = ({ message }) => {
  return (
    <Card className='mb-4'>
      <CardHeader className='py-3'>
        <h1 className='flex items-center text-lg'>Error</h1>
      </CardHeader>
      <CardContent className='pb-3'>
        <div className='flex items-center'>
          <div className='w-full'>
            <p className='text-sm opacity-80'>{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
