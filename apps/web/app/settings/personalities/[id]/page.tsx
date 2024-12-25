'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { personalityFormSchema } from '../_schemas/personality-schema';

export default function PersonalityViewPage() {
  const params = useParams();
  const router = useRouter();
  const personalityId = params.id as string;

  const form = useForm<z.infer<typeof personalityFormSchema>>({
    resolver: zodResolver(personalityFormSchema),
    defaultValues: {
      name: '',
      systemPrompt: '',
      maxContextLength: 10,
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
            maxContextLength: result.data.settings.maxContextLength,
          });
        }
      } catch (error) {
        console.error('Error fetching personality:', error);
      }
    };

    fetchPersonality();
  }, [personalityId, form]);

  const onSubmit = async (data: z.infer<typeof personalityFormSchema>) => {
    try {
      const response = await fetch(`/api/personality/${personalityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          maxContextLength: data.maxContextLength,
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
  };

  return (
    <main className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Personality Details</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='destructive'>Delete Personality</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Personality</DialogTitle>
              <DialogDescription>Are you sure you want to delete this personality? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <div className='flex justify-end gap-4 mt-4'>
              <DialogTrigger asChild>
                <Button variant='outline'>Cancel</Button>
              </DialogTrigger>
              <Button variant='destructive' onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='bg-card rounded-lg  shadow-sm'>
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
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
