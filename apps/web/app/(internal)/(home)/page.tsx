import { ChatHistory } from '@/components/custom/chat-history';
import { ChatInput } from '@/components/custom/chat-input';

export default function Home() {
  return (
    <div className='w-full h-full flex flex-col'>
      <ChatHistory />
      <ChatInput />
    </div>
  );
}
