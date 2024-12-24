import { prisma } from '@repo/database'; // or wherever your Prisma instance is
import { error } from '@repo/logger';
import { type NextRequest, NextResponse } from 'next/server';

const PYTHON_API_ENDPOINT = process.env.PYTHON_API_ENDPOINT || 'http://localhost:8001/chat';

interface ChatRequestBody {
  userId: string;
  message: string;
  personalityId: string; // The chosen personality
}

export const POST = async (request: NextRequest) => {
  try {
    const body: ChatRequestBody = await request.json();

    if (!body.userId || !body.message || !body.personalityId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch the specified Personality + its settings
    const personality = await prisma.personality.findUnique({
      where: { id: body.personalityId },
      include: { settings: true },
    });

    if (!personality) {
      return NextResponse.json({ error: 'No personality found' }, { status: 404 });
    }
    const { settings } = personality;
    const { maxContextLength, systemPrompt } = settings;

    // 2. Fetch the last N messages from ChatLog
    const recentMessages = await prisma.chatLog.findMany({
      where: { userId: body.userId },
      orderBy: { createdAt: 'desc' },
      take: maxContextLength,
    });

    // We want them in chronological order (oldest->newest)
    const conversation = recentMessages.reverse().map((log) => ({
      via: log.via,
      message: log.message,
    }));

    // 3. Append the new user message
    conversation.push({ via: 'TEXT', message: body.message });

    // 4. Call the Python service
    // We send the systemPrompt, conversation, etc.
    const response = await fetch(PYTHON_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,
        conversation,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      error(`Error from Python service: ${text}`);
      return NextResponse.json({ error: 'Python service error' }, { status: 500 });
    }

    const data = await response.json();
    const { reply } = data;
    if (!reply) {
      return NextResponse.json({ error: 'No reply from Python' }, { status: 500 });
    }

    // 5. Store the user’s new message & the bot’s reply in ChatLog
    //    We already have the user’s new message in memory, but let's ensure it's in DB if needed.
    //    For example, we can create it if not already created:
    await prisma.chatLog.create({
      data: {
        via: 'TEXT',
        message: body.message,
        userId: body.userId,
      },
    });

    // Then store the bot’s reply:
    await prisma.chatLog.create({
      data: {
        via: 'TEXT',
        message: reply,
        userId: body.userId,
      },
    });

    // 6. Return the bot’s reply
    return NextResponse.json({ reply });
  } catch (e) {
    const err = e as Error;
    error('Error in /api/generate/chat route:', { err });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
