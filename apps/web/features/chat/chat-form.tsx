'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import type { Personality } from '@prisma/client';
import { ArrowUp } from 'lucide-react';

import { ChatError } from './chat-error';
import { ChatInput } from './input';
import { PersonalitySelector } from './personality-selector';

// 1. Updated schema to have `personality`
const schema = z.object({
  message: z.string().min(1, 'Message is required'),
  personalityId: z.string().min(1, 'Personality is required'),
});

type FormData = z.infer<typeof schema>;

export function ChatForm() {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [personalities, setPersonalities] = useState<Personality[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { message: '', personalityId: '' },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // Fetch personalities + user data on mount
  useEffect(() => {
    const fetchUserAndPersonalities = async () => {
      try {
        // 1) Fetch personalities
        const personalitiesResponse = await fetch('/api/personalities');
        if (!personalitiesResponse.ok) {
          setFetchError(`Error fetching personalities (status: ${personalitiesResponse.status})`);
          return;
        }
        const personalitiesData = await personalitiesResponse.json();

        if (personalitiesData.status !== 200 || !personalitiesData.data) {
          setFetchError(personalitiesData.error || 'Error in personalities response');
          return;
        }

        // We have personalities
        setPersonalities(personalitiesData.data);

        // 2) Fetch user data to get default personality
        const userResponse = await fetch('/api/me');
        if (!userResponse.ok) {
          setFetchError(`Error fetching user (status: ${userResponse.status})`);
          return;
        }
        const userData = await userResponse.json();

        const defaultPersonalityId = userData.user?.selectedPersonalityId || personalitiesData.data[0]?.id;
        if (defaultPersonalityId) {
          reset({ message: '', personalityId: defaultPersonalityId }, { keepErrors: true, keepDirty: false });
        }
      } catch (error) {
        if (error instanceof Error) {
          setFetchError(error.message);
        } else {
          setFetchError(String(error));
        }
      }
    };

    fetchUserAndPersonalities();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setFetchError(null); // Clear any prior top-level errors
    try {
      const response = await fetch('/api/generate/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: data.message,
          personalityId: data.personalityId,
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        // Show the entire error (statusText + body) in ChatError
        setFetchError(`Error generating response: ${response.statusText}\n${body}`);
      } else {
        const { reply } = await response.json();
        console.log('Response:', reply);
      }
    } catch (error) {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError(String(error));
      }
    } finally {
      // Keep the same personality but reset message
      reset((formValues) => ({ ...formValues, message: '' }), { keepErrors: false, keepDirty: false });
      clearErrors(['message']);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      {/* --- Top-level fetch error, if any --- */}
      {fetchError && <ChatError message={fetchError} />}

      {/* Show any message errors */}
      {errors.message?.message && <ChatError message={errors.message.message} />}

      {/* Show any personality errors */}
      {errors.personalityId?.message && <ChatError message={errors.personalityId.message} />}

      <div className='flex items-center space-x-2'>
        <div>Personality</div>
        <Controller
          name='personalityId'
          control={control}
          render={({ field }) => {
            const { onChange, value } = field;
            return <PersonalitySelector value={value} onChange={onChange} personalities={personalities} />;
          }}
        />
      </div>

      <Controller
        name='message'
        control={control}
        render={({ field }) => {
          const { onChange, value } = field;
          return (
            <ChatInput
              placeholder='Say something...'
              value={value}
              onChange={(textValue) => onChange(textValue)}
              onEnter={() => handleSubmit(onSubmit)()}
            >
              <Button className='rounded-full p-1 h-7 w-7' type='submit' disabled={value.length === 0 || isSubmitting}>
                {isSubmitting ? <div className='animate-spin h-4 w-4 border-b-2 border-white rounded-full' /> : <ArrowUp className='h-4 w-4' />}
              </Button>
            </ChatInput>
          );
        }}
      />
    </form>
  );
}
