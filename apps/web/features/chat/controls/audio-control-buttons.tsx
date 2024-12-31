import { Button } from '@/components/ui/button';
import { ArrowUp, Mic, X } from 'lucide-react';
import type React from 'react';
import { useContext } from 'react';
import { AudioInputContext } from '../audio-input/context';

interface AudioControlButtonProps {
  isSubmitting: boolean;
  show: boolean;
}

export const AudioControlButtons: React.FC<AudioControlButtonProps> = ({ isSubmitting, show }) => {
  const { startRecording, isRecordingInProgress, stopRecording } = useContext(AudioInputContext);

  if (!show) {
    return null;
  }

  if (isRecordingInProgress) {
    return (
      <div className='flex space-x-2'>
        <Button className='rounded-full p-1 h-7 w-7 bg-accent hover:bg-neutral-700' type='button' disabled={isSubmitting} onClick={stopRecording}>
          <X className='h-4 w-4 text-red-500 ' />
        </Button>
        <Button className='rounded-full p-1 h-7 w-7' type='submit' disabled={isSubmitting}>
          {isSubmitting ? <div className='animate-spin h-4 w-4 border-b-2 border-white rounded-full' /> : <ArrowUp className='h-4 w-4' />}
        </Button>
      </div>
    );
  }

  return (
    <Button className='rounded-full p-1 h-7 w-7' type='button' disabled={isSubmitting} onClick={startRecording}>
      <Mic className='h-4 w-4' />
    </Button>
  );
};
