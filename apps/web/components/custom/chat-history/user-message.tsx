import { Card, CardContent } from '@/components/ui/card';
import type { ChatLog } from '@prisma/client';
import type React from 'react';

interface UserMessageProps {
  msg: Omit<ChatLog, 'userId' | 'user' | 'updatedAt'>;
}

export const UserMessage: React.FC<UserMessageProps> = ({ msg }) => {
  return (
    <Card>
      <CardContent className='p-0'>
        <div className='flex items-center p-4'>
          <img src='https://placehold.co/40x40/333/FFF' alt='User avatar' className='rounded-full w-10 h-10 mr-3' />
          <div className='w-full'>
            <div className='flex justify-between items-center w-full'>
              <span className='font-bold'>User</span>
              <span className='text-xs text-foreground opacity-50'>{msg.createdAt.toLocaleString()}</span>
            </div>
            <p className='text-sm opacity-80'>{msg.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
