'use server';

import { prisma } from '@repo/database';

/**
 * Fetch a personality by its ID
 * @param id The ID of the personality to fetch
 * @returns The personality and its settings
 */
export const getPersonality = async (id: string) => {
  return prisma.personality.findUnique({
    where: { id },
    include: { settings: true },
  });
};
