import { Card, CardContent } from '@/components/ui/card';
import type { ChatLog, Personality } from '@prisma/client';
import type React from 'react';

interface SystemMessageProps {
  message: ChatLog['message'];
  personality: {
    name: Personality['name'];
  };
  createdAt: ChatLog['createdAt'];
}

export const SystemMessage: React.FC<SystemMessageProps> = ({ message, personality, createdAt }) => {
  return (
    <Card>
      <CardContent className='p-0'>
        <div className='flex items-center p-4'>
          <img src='https://placehold.co/40x40/333/FFF' alt='System avatar' className='rounded-full w-10 h-10 mr-3' />
          <div className='w-full'>
            <div className='flex justify-between items-center w-full'>
              <span className='font-bold'>{personality?.name}</span>
              <span className='text-xs text-foreground opacity-50'>{createdAt.toLocaleString()}</span>
            </div>
            <p className='text-sm opacity-80'>{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
