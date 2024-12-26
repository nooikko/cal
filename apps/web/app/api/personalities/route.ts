import { prisma } from '@repo/database';
import { NextResponse } from 'next/server';

export type GetManyResponse = {
  status: number;
  data?: Array<{
    id: string;
    name: string;
    settings: {
      id: string;
      maxContextLength: number;
      systemPrompt: string;
    };
  }>;
  error?: string;
};

export const GET = async (): Promise<NextResponse<GetManyResponse>> => {
  try {
    console.log('here');
    const items = await prisma.personality.findMany({
      include: {
        settings: true,
      },
    });

    return NextResponse.json({
      status: 200,
      data: items,
    });
  } catch (err: unknown) {
    console.error('Error fetching personalities:', err);

    let message = 'An error occurred while fetching personalities';
    if (err instanceof Error && err.message) {
      message = err.message;
    } else if (err) {
      message = String(err);
    }

    return NextResponse.json({ status: 500, error: message }, { status: 500 });
  }
};
