import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import type React from 'react';

interface ChatControlButtonProps {
  isSubmitting: boolean;
  show: boolean;
}

export const ChatControlButton: React.FC<ChatControlButtonProps> = ({ isSubmitting, show }) => {
  if (!show) {
    return null;
  }

  return (
    <Button className='rounded-full p-1 h-7 w-7' type='submit' disabled={isSubmitting}>
      {isSubmitting ? <div className='animate-spin h-4 w-4 border-b-2 border-white rounded-full' /> : <ArrowUp className='h-4 w-4' />}
    </Button>
  );
};
