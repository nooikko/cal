'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { formSchema } from './_schemas/schema';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';
import { baseSystemPrompt } from './_base-data';

export default function NewPersonality() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      systemPrompt: baseSystemPrompt,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/personality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
    <div className='max-w-2xl mx-auto w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personality Name</FormLabel>
                <FormControl>
                  <Input placeholder='E.g. Cal' className='text-lg' {...field} />
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
                <FormLabel>System Prompt</FormLabel>
                <FormControl>
                  <Textarea placeholder='E.g. Cal' className='text-lg' rows={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  );
}
