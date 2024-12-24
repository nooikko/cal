import { prisma } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Invalid input: Name is required' }, { status: 400, statusText: 'Bad Request' });
    }

    if (!body.systemPrompt) {
      return NextResponse.json({ error: 'Invalid input: System prompt is required' }, { status: 400, statusText: 'Bad Request' });
    }

    // Create the personality in the database
    const personality = await prisma.personality.create({
      data: {
        name: body.name,
        settings: {
          create: {
            maxContextLength: 10, // Default value
            systemPrompt: body.systemPrompt,
          },
        },
      },
      include: {
        settings: true,
      },
    });

    // Revalidate the personalities list and the new personality page
    revalidatePath('/settings');
    revalidatePath(`/settings/personalities/${personality.id}`);

    return NextResponse.json({ message: 'Resource created', personality }, { status: 201, statusText: 'Created' });
  } catch (error) {
    console.error('Error creating personality:', error);
    return NextResponse.json({ error: 'An error occurred while creating the personality' }, { status: 500, statusText: 'Internal Server Error' });
  }
};
