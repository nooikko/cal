import { apiAuth } from '@/helpers/api-auth';
import { prisma } from '@repo/database';
import { NextResponse } from 'next/server';

export const GET = apiAuth(async (request) => {
  try {
    const { auth } = request;

    if (!auth?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the user with their selected personality
    const user = await prisma.user.findUnique({
      where: { id: auth.user.sub },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        selectedPersonalityId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user data including their selected personality
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        selectedPersonalityId: user.selectedPersonalityId,
      },
    });
  } catch (e) {
    console.error('Error in /api/me:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
