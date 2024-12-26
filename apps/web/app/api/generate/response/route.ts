import { apiAuth } from '@/helpers/api-auth';
import { prisma } from '@repo/database';
import { error } from '@repo/logger';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const PYTHON_API_ENDPOINT = process.env.PYTHON_API_ENDPOINT || 'http://localhost:8001/chat';

interface ChatRequestBody {
  message: string;
  personalityId: string; // The chosen personality
}

const ChatRequestBodySchema = z.object({
  message: z.string().min(1),
  personalityId: z.string().min(1),
});

export const POST = apiAuth(async (request) => {
  try {
    const { auth } = request;

    if (!auth?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ChatRequestBody = await request.json();

    const parsedBody = ChatRequestBodySchema.safeParse(body);
    if (!parsedBody.success) {
      const firstIssue = parsedBody.error.issues[0];
      return NextResponse.json({ error: `Missing ${firstIssue?.path[0]}` }, { status: 400 });
    }

    const { message, personalityId } = parsedBody.data;

    // 1. Fetch the specified Personality + its settings
    const personality = await prisma.personality.findUnique({
      where: { id: personalityId },
      include: { settings: true },
    });

    if (!personality) {
      return NextResponse.json({ error: 'No personality found' }, { status: 404 });
    }
    const { settings } = personality;
    const { maxContextLength, systemPrompt } = settings;

    const recentMessages = await prisma.chatLog.findMany({
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
      message: message,
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
    console.info('Python response:', data);
    const { reply } = data;

    console.info('Python reply:', reply);
    if (!reply) {
      return NextResponse.json({ error: 'No reply from Python' }, { status: 500 });
    }

    await prisma.chatLog.create({
      data: {
        senderType: 'USER',
        via: 'TEXT',
        message: message,
        userId: auth.user.sub,
      },
    });

    //    System message: senderType=SYSTEM, personalityId=body.personalityId
    await prisma.chatLog.create({
      data: {
        senderType: 'SYSTEM',
        via: 'TEXT',
        message: reply,
        personalityId,
        userId: null, // Link to the bot personality
      },
    });

    // 6. Return the bot’s reply
    return NextResponse.json({ reply }, { status: 200 });
  } catch (e) {
    const err = e as Error;
    error('Error in /api/generate/chat route:', { err });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
