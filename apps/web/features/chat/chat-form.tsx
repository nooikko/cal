'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { ChatError } from './chat-error';
import { ChatInput } from './input';

const schema = z.object({
  message: z.string().min(1, 'Message is required'),
});

type FormData = z.infer<typeof schema>;

export function ChatForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { message: '' },
  });

  const onSubmit = (data: FormData) => {
    console.log('Submitted message:', data.message);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.message?.message && <ChatError message={errors.message.message} />}

      <Controller
        name='message'
        control={control}
        render={({ field }) => {
          const { onChange, value } = field;

          return (
            <ChatInput
              placeholder='Say something...'
              value={value}
              onChange={(textValue: string) => onChange(textValue)}
              onEnter={() => handleSubmit(onSubmit)()}
            >
              <Button className='rounded-full p-1 h-7 w-7' type='submit' disabled={value.length === 0}>
                <ArrowUp className='h-4 w-4' />
              </Button>
            </ChatInput>
          );
        }}
      />
    </form>
  );
}
