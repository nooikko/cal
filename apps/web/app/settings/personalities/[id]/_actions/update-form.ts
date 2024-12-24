'use server';

import { prisma } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { z } from 'zod';
import type { updateFormSchema } from '../_schemas/schema';

export async function updateForm(id: string, data: z.infer<typeof updateFormSchema>) {
  try {
    const personality = await prisma.personality.update({
      where: { id },
      data: {
        name: data.name,
        settings: {
          update: {
            systemPrompt: data.systemPrompt,
          },
        },
      },
      include: {
        settings: true,
      },
    });

    revalidatePath(`/settings/personalities/${personality.id}`);
    return redirect(`/settings/personalities/${personality.id}`);
  } catch (error) {
    console.error('Error updating personality:', error);
    throw error;
  }
}

export async function deletePersonality(id: string) {
  try {
    await prisma.personality.delete({
      where: { id },
    });

    revalidatePath('/settings/personalities');
    return redirect('/settings/personalities');
  } catch (error) {
    console.error('Error deleting personality:', error);
    throw error;
  }
}
