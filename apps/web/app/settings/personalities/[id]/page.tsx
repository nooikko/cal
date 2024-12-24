'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getPersonality } from './_actions/get-personality';
import { deletePersonality, updateForm } from './_actions/update-form';
import { updateFormSchema } from './_schemas/schema';

export default async function PersonalityViewPage() {
  const params = useParams();
  const personalityId = params.id as string;
  const personality = await getPersonality(personalityId);

  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: personality?.name ?? '',
      systemPrompt: personality?.settings?.systemPrompt ?? '',
    },
  });

  if (!personality) {
    return <div>Personality not found</div>;
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this personality?')) {
      await deletePersonality(personalityId);
    }
  };

  return (
    <main className='flex-1 p-8'>
      <h1 className='text-2xl font-bold mb-6'>Personality Details</h1>

      <div className='max-w-2xl space-y-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => updateForm(personalityId, data))} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter personality name' {...field} />
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
                    <Textarea placeholder='Enter system prompt' className='min-h-[200px]' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-between'>
              <Button type='submit'>Update Personality</Button>
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
