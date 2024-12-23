import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'small' | 'base' | 'large';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'base', className }) => {
  let spinnerSize = cn('h-5', 'w-5', 'text-primary-500');
  switch (size) {
    case 'small':
      spinnerSize = cn('h-4', 'w-4', 'text-primary-400');
      break;
    case 'large':
      spinnerSize = cn('h-6', 'w-6', 'text-primary-600');
      break;
  }
  return (
    <div className={cn('flex', 'items-center', 'justify-center', className)}>
      <Loader2 className={cn(spinnerSize, 'animate-spin')} />
    </div>
  );
};
