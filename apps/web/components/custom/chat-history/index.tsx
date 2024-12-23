import { ChatVia } from '@prisma/client';
import { CalMessage } from './cal-message';

export const ChatHistory = () => {
  const messages = [
    {
      id: '1',
      via: ChatVia.TEXT,
      user: 'Cal',
      createdAt: new Date(),
      message: 'Hello! How can I assist you today?',
      audioRecordingId: null,
      audioRecording: null,
    },
  ];

  return (
    <div className='flex-1 overflow-y-auto'>
      <div className='chat-history'>
        {messages.map((msg) => (
          <CalMessage key={msg.id} msg={msg} />
        ))}
      </div>
    </div>
  );
};
