import { prisma } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';

// Define response types
export type GetResponse = {
  status: number;
  data?: {
    id: string;
    name: string;
    settings: {
      id: string;
      maxContextLength: number;
      systemPrompt: string;
    };
  };
  error?: string;
};

export type PatchResponse = {
  status: number;
  data?: {
    id: string;
    name: string;
    settings: {
      id: string;
      maxContextLength: number;
      systemPrompt: string;
    };
  };
  error?: string;
};

export type DeleteResponse = {
  status: number;
  message?: string;
  error?: string;
};

export const GET = async (_request: NextRequest, context: { params: { id: string } }): Promise<NextResponse<GetResponse>> => {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ status: 400, error: 'ID parameter is required' });
    }

    const personality = await prisma.personality.findUnique({
      where: { id },
      include: { settings: true },
    });

    if (!personality) {
      return NextResponse.json({ status: 404, error: 'Personality not found' });
    }

    return NextResponse.json({ status: 200, data: personality });
  } catch (error) {
    console.error('Error fetching personality:', error);
    return NextResponse.json({ status: 500, error: 'An error occurred while fetching the personality' });
  }
};

export const PATCH = async (request: NextRequest, context: { params: { id: string } }): Promise<NextResponse<PatchResponse>> => {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ status: 400, error: 'ID parameter is required' });
    }

    const body = await request.json();

    if (!body.name || !body.systemPrompt || body.maxContextLength == null) {
      return NextResponse.json({
        status: 400,
        error: 'Invalid input: name, systemPrompt, and maxContextLength are required',
      });
    }

    const existingPersonality = await prisma.personality.findUnique({ where: { id } });

    if (!existingPersonality) {
      return NextResponse.json({ status: 404, error: 'Personality not found' });
    }

    const updatedPersonality = await prisma.personality.update({
      where: { id },
      data: {
        name: body.name,
        settings: {
          update: {
            systemPrompt: body.systemPrompt,
            maxContextLength: body.maxContextLength,
          },
        },
      },
      include: { settings: true },
    });

    return NextResponse.json({ status: 200, data: updatedPersonality });
  } catch (error) {
    console.error('Error updating personality:', error);
    return NextResponse.json({ status: 500, error: 'An error occurred while updating the personality' });
  }
};

export const DELETE = async (_request: NextRequest, context: { params: { id: string } }): Promise<NextResponse<DeleteResponse>> => {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ status: 400, error: 'ID parameter is required' });
    }

    const existingPersonality = await prisma.personality.findUnique({ where: { id } });

    if (!existingPersonality) {
      return NextResponse.json({ status: 404, error: 'Personality not found' });
    }

    await prisma.personality.delete({
      where: { id },
    });

    return NextResponse.json({ status: 204, message: 'Personality deleted successfully' });
  } catch (error) {
    console.error('Error deleting personality:', error);
    return NextResponse.json({ status: 500, error: 'An error occurred while deleting the personality' });
  }
};
