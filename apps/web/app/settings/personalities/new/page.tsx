'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { personalityFormSchema } from '../_schemas/personality-schema';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';
import { baseSystemPrompt } from './_base-data';

export default function NewPersonality() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof personalityFormSchema>>({
    resolver: zodResolver(personalityFormSchema),
    defaultValues: {
      name: '',
      systemPrompt: baseSystemPrompt,
      maxContextLength: 10,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof personalityFormSchema>) => {
    try {
      const response = await fetch('/api/personality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          maxContextLength: data.maxContextLength,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create personality');
      }

      const result = await response.json();
      router.push(`/settings/personalities/${result.personality.id}`);
      router.refresh(); // This will trigger a revalidation of the page
    } catch (error) {
      console.error('Error creating personality:', error);
      // Handle error appropriately
    }
  };

  return (
    <main className='container mx-auto px-4 py-8 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-8'>Create New Personality</h1>

      <div className='bg-card rounded-lg shadow-sm'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-lg'>Personality Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter personality name' className='text-lg' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='systemPrompt'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-lg'>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Enter system prompt' className='min-h-[200px] text-lg' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='maxContextLength'
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel className='text-lg'>Max Context Length: {value}</FormLabel>
                  <FormControl>
                    <Slider min={1} max={100} step={1} value={[value]} onValueChange={(vals) => onChange(vals[0])} className='py-4' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button type='submit' size='lg'>
                Create Personality
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
