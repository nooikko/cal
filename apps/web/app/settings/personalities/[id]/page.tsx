'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateFormSchema } from './_schemas/schema';

export default function PersonalityViewPage() {
  const params = useParams();
  const router = useRouter();
  const personalityId = params.id as string;

  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: '',
      systemPrompt: '',
    },
  });

  useEffect(() => {
    const fetchPersonality = async () => {
      try {
        const response = await fetch(`/api/personality/${personalityId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch personality');
        }
        const result = await response.json();
        if (result.data) {
          form.reset({
            name: result.data.name,
            systemPrompt: result.data.settings.systemPrompt,
          });
        }
      } catch (error) {
        console.error('Error fetching personality:', error);
      }
    };

    fetchPersonality();
  }, [personalityId, form]);

  const onSubmit = async (data: z.infer<typeof updateFormSchema>) => {
    try {
      const response = await fetch(`/api/personality/${personalityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          maxContextLength: 10, // Keeping the default value
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update personality');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating personality:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this personality?')) {
      try {
        const response = await fetch(`/api/personality/${personalityId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete personality');
        }

        router.push('/settings/personalities');
        router.refresh();
      } catch (error) {
        console.error('Error deleting personality:', error);
      }
    }
  };

  return (
    <main className='flex-1 p-8'>
      <h1 className='text-2xl font-bold mb-6'>Personality Details</h1>

      <div className='max-w-2xl space-y-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea rows={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-between'>
              <Button type='submit'>Save Changes</Button>
              <Button type='button' variant='destructive' onClick={handleDelete}>
                Delete Personality
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
