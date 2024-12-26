'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

import { ChatError } from './chat-error';
import { useChatData } from './hooks/use-chat-data';
import { useChatSubmit } from './hooks/use-chat-submit';
import { ChatInput } from './input';
import { PersonalitySelector } from './personality-selector';

// 1. Updated schema to have `personality`
const schema = z.object({
  message: z.string().min(1, 'Message is required'),
  personalityId: z.string().min(1, 'Personality is required'),
});

type FormData = z.infer<typeof schema>;

export function ChatForm() {
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

  // Hook that auto-fetches personalities & user info once on mount
  const { fetchError, setFetchError, personalities } = useChatData(reset);

  // For the form submission logic
  const { onSubmit } = useChatSubmit(reset, clearErrors, setFetchError);

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
