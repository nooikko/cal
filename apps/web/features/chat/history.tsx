'use client';
import type { ChatLogsGetManyResponse } from '@/app/api/chat-logs/route';
import { SystemMessage } from '@/features/chat/messages/system-message';
import { SenderType } from '@prisma/client';
import { useEffect, useState } from 'react';
import { ChatError } from './chat-error';
import { UserMessage } from './messages/user-message';

export const ChatHistory = () => {
  const [messages, setMessages] = useState<NonNullable<ChatLogsGetManyResponse['data']>>([]);

  useEffect(() => {
    const fetchChatLogs = async () => {
      try {
        const response = await fetch('/api/chat-logs');
        const data: ChatLogsGetManyResponse = await response.json();
        setMessages(data.data ?? []);
      } catch (error) {
        console.error('Error fetching chat logs:', error);
      }
    };

    fetchChatLogs();
  }, []);

  return (
    <div className='flex-1 overflow-y-auto'>
      <div className='chat-history'>
        {messages.map((msg) => {
          if (msg.senderType === SenderType.SYSTEM) {
            if (!msg?.personality?.name) {
              throw new Error('Personality name is required for system messages');
            }

            return <SystemMessage key={msg.id} message={msg.message} personality={msg.personality} createdAt={new Date(msg.createdAt)} />;
          }
          if (msg.senderType === SenderType.USER) {
            if (!msg?.user?.name) {
              throw new Error('User name is required for user messages');
            }

            <UserMessage key={msg.id} message={msg.message} user={msg.user} createdAt={new Date(msg.createdAt)} />;
          }

          return <ChatError key={msg.id} message='Unknown sender type' />;
        })}
      </div>
    </div>
  );
};
