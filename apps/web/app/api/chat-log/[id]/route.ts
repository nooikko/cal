import type { ChatLog, ChatVia, Personality, SenderType, User } from '@prisma/client';
import { prisma } from '@repo/database';
import { error } from '@repo/logger';
import { type NextRequest, NextResponse } from 'next/server';

// Define shared response types
export type GetResponse = {
  status: number;
  data?: {
    message: ChatLog['message'] | null;
    via: ChatVia;
    createdAt: ChatLog['createdAt'];
    senderType: SenderType;
    personality: Pick<Personality, 'id' | 'name'> | null;
    user: Pick<User, 'id' | 'name'> | null;
  }[];
  error?: string;
};

export type PatchResponse = {
  status: number;
  data?: {
    id: string;
    createdAt: Date;
    message: ChatLog['message'] | null;
    via: ChatVia;
    senderType: SenderType;
    personality: Pick<Personality, 'id' | 'name'> | null;
    user: Pick<User, 'id' | 'name'> | null;
  };
  error?: string;
};

export type DeleteResponse = {
  status: number;
  message?: string;
  error?: string;
};

export const GET = async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<GetResponse>> => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ status: 400, error: 'ID parameter is required' });
    }

    const chatLog = await prisma.chatLog.findUnique({
      where: { id },
      select: {
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

    if (!chatLog) {
      return NextResponse.json({ status: 404, error: 'Chat log not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      data: [chatLog], // Wrap in an array for consistent `data` structure
    });
  } catch (e) {
    const err = e as Error;
    error('Error fetching chat log:', { err });

    let message = 'An error occurred while fetching the chat log';
    if (err instanceof Error && err.message) {
      message = err.message;
    }

    return NextResponse.json({ status: 500, error: message }, { status: 500 });
  }
};

export const PATCH = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<PatchResponse>> => {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ status: 400, error: 'ID parameter is required' });
    }

    const updatedChatLog = await prisma.chatLog.update({
      where: { id },
      data: body,
      select: {
        id: true,
        createdAt: true,
        message: true,
        via: true,
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
      data: updatedChatLog,
    });
  } catch (e) {
    const err = e as Error;
    error('Error updating chat log:', { err });

    let message = 'An error occurred while updating the chat log';
    if (err instanceof Error && err.message) {
      message = err.message;
    }

    return NextResponse.json({ status: 500, error: message }, { status: 500 });
  }
};

export const DELETE = async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<DeleteResponse>> => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ status: 400, error: 'ID parameter is required' });
    }

    await prisma.chatLog.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 200,
      message: 'Chat log deleted successfully',
    });
  } catch (e) {
    const err = e as Error;
    error('Error deleting chat log:', { err });

    let message = 'An error occurred while deleting the chat log';
    if (err instanceof Error && err.message) {
      message = err.message;
    }

    return NextResponse.json({ status: 500, error: message }, { status: 500 });
  }
};
