'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { AudioInput } from './audio-input';
import { AudioInputContext } from './audio-input/context';
import { ChatError } from './chat-error';
import { AudioControlButtons } from './controls/audio-control-buttons';
import { ChatControlButton } from './controls/chat-control-buttons';
import { useChatData } from './hooks/use-chat-data';
import { useChatSubmit } from './hooks/use-chat-submit';
import { ChatInput } from './input';
import { PersonalitySelector } from './personality-selector';

// 1. Updated schema to have `personality`
const schema = z.object({
  message: z.string().optional(),
  personalityId: z.string().min(1, 'Personality is required'),
  audioBlob: z.boolean().optional(),
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
    defaultValues: { message: '', personalityId: '', audioBlob: false },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const { fetchError, setFetchError, personalities } = useChatData(reset);
  const { isRecordingInProgress, stopRecording } = useContext(AudioInputContext);
  const { onSubmit } = useChatSubmit(reset, clearErrors, setFetchError);

  const handleFormSubmit = (data: FormData) => {
    const dataWithAudio = { ...data, audioBlob: isRecordingInProgress };
    if (isRecordingInProgress) {
      stopRecording();
    }
    console.log(dataWithAudio);
    onSubmit(dataWithAudio);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        handleSubmit(handleFormSubmit)();
      }}
      className='flex flex-col gap-4'
    >
      {fetchError && <ChatError message={fetchError} />}
      {errors.message?.message && <ChatError message={errors.message.message} />}
      {errors.personalityId?.message && <ChatError message={errors.personalityId.message} />}

      <AudioInput />

      <div className='flex items-center space-x-2'>
        <div>Personality</div>
        <Controller
          name='personalityId'
          control={control}
          render={({ field }) => <PersonalitySelector value={field.value} onChange={field.onChange} personalities={personalities} />}
        />
      </div>

      <Controller
        name='message'
        control={control}
        render={({ field }) => (
          <ChatInput placeholder='Say something...' value={field.value} onChange={field.onChange} onEnter={() => handleSubmit(handleFormSubmit)()}>
            <ChatControlButton isSubmitting={isSubmitting} show={(field.value?.length ?? 0) > 0} />
            <AudioControlButtons isSubmitting={isSubmitting} show={(field.value?.length ?? 0) === 0} />
          </ChatInput>
        )}
      />
    </form>
  );
}
