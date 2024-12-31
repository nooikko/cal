import { AudioInputProvider } from '@/features/chat/audio-input/context';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AudioInputProvider>{children}</AudioInputProvider>;
}
