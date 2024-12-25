import { Prisma } from '@prisma/client'; // <-- Import Prisma here
import { prisma } from '@repo/database';
import { type NextRequest, NextResponse } from 'next/server';

export type GetManyResponse = {
  status: number;
  data?: {
    items: Array<{
      id: string;
      name: string;
      settings: {
        id: string;
        maxContextLength: number;
        systemPrompt: string;
      };
    }>;
    total: number;
    page: number;
    pageSize: number;
  };
  error?: string;
};

export const GET = async (request: NextRequest): Promise<NextResponse<GetManyResponse>> => {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') ?? '1');
    const pageSize = Number.parseInt(searchParams.get('pageSize') ?? '10');
    const search = searchParams.get('search') ?? '';

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              settings: {
                systemPrompt: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          ],
        }
      : {};

    // Get total count for pagination
    const total = await prisma.personality.count({ where });

    // Get paginated and filtered results
    const items = await prisma.personality.findMany({
      where,
      include: {
        settings: true,
      },
      skip,
      take: pageSize,
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      status: 200,
      data: {
        items,
        total,
        page,
        pageSize,
      },
    });
  } catch (error) {
    console.error('Error fetching personalities:', error);
    return NextResponse.json({ status: 500, error: 'An error occurred while fetching personalities' }, { status: 500 });
  }
};
