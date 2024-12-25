import { SystemMessage } from '@/features/chat/messages/system-message';
import { ChatVia, SenderType } from '@prisma/client';

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
      senderType: SenderType.SYSTEM,
      personalityId: null,
    },
  ];

  return (
    <div className='flex-1 overflow-y-auto'>
      <div className='chat-history'>
        {messages.map((msg) => (
          <SystemMessage key={msg.id} msg={msg} />
        ))}
      </div>
    </div>
  );
};
