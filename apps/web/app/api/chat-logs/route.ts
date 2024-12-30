import type { ChatLog, ChatVia, Personality, SenderType, User } from '@prisma/client';
import { prisma } from '@repo/database';
import { error } from '@repo/logger';
import { NextResponse } from 'next/server';

export type ChatLogsGetManyResponse = {
  status: number;
  data?: {
    id: ChatLog['id'];
    message: ChatLog['message'] | null;
    via: ChatVia;
    createdAt: ChatLog['createdAt'];
    senderType: SenderType;
    personality: {
      name: Personality['name'];
    } | null;
    user: {
      name: User['name'];
    } | null;
  }[];
  error?: string;
};

export const GET = async (): Promise<NextResponse<ChatLogsGetManyResponse>> => {
  try {
    const messages = await prisma.chatLog.findMany({
      select: {
        id: true,
        message: true,
        via: true,
        createdAt: true,
        senderType: true,
        personality: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      data: messages,
    });
  } catch (e) {
    const err = e as Error;
    error('Error fetching chat logs:', { err });

    let message = 'An error occurred while fetching chat logs';
    if (err instanceof Error && err.message) {
      message = err.message;
    }

    return NextResponse.json({ status: 500, error: message }, { status: 500 });
  }
};
