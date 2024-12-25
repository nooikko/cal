import { prisma } from '@repo/database';
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

    // 2. Fetch the last N messages from ChatLog for this user
    const recentMessages = await prisma.chatLog.findMany({
      where: { userId: body.userId },
      orderBy: { createdAt: 'desc' },
      take: maxContextLength,
    });

    // We want them in chronological order (oldest->newest)
    const conversation = recentMessages.reverse().map((log) => ({
      via: log.via,
      message: log.message,
      senderType: log.senderType,
    }));

    // 3. Append the *new user message* to the conversation
    //    (We haven't created it in the DB yet; we do that after the Python call or right now.)
    conversation.push({
      via: 'TEXT',
      message: body.message,
      senderType: 'USER',
    });

    // 4. Call the Python service
    //    We send the systemPrompt, conversation, etc.
    const response = await fetch(PYTHON_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,
        conversation: conversation.map((c) => ({
          // The Python side only needs the message text (or other minimal fields)
          message: c.message,
        })),
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

    // 5. Store both the user’s new message & the system’s reply in ChatLog
    //    User message: senderType=USER, userId=body.userId
    await prisma.chatLog.create({
      data: {
        senderType: 'USER',
        via: 'TEXT',
        message: body.message,
        userId: body.userId,
        // personalityId is not set here, since the user is not the personality
      },
    });

    //    System message: senderType=SYSTEM, personalityId=body.personalityId
    await prisma.chatLog.create({
      data: {
        senderType: 'SYSTEM',
        via: 'TEXT',
        message: reply,
        personalityId: body.personalityId, // Link to the bot personality
        // userId is not set, since this is from the system/bot
      },
    });

    // 6. Return the bot’s reply
    return NextResponse.json({ reply }, { status: 200 });
  } catch (e) {
    const err = e as Error;
    error('Error in /api/generate/chat route:', { err });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
