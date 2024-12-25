import { z } from 'zod';

export const personalityFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  systemPrompt: z.string().min(2, {
    message: 'System prompt must be at least 2 characters.',
  }),
  maxContextLength: z.number().min(1).max(100),
});
