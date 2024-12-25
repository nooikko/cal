import { ChatForm } from '@/features/chat/chat-form';
import { ChatHistory } from '@/features/chat/history';

export default function Home() {
  return (
    <div className='w-full h-full flex flex-col'>
      <ChatHistory />
      <ChatForm />
    </div>
  );
}
