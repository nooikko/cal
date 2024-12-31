import { convertAudioBufferToFloat32, convertSampleRate } from '@repo/converters';
import { useCallback, useContext } from 'react';
import type { UseFormClearErrors, UseFormReset } from 'react-hook-form';
import { AudioInputContext } from '../audio-input/context';

type FormData = {
  personalityId: string;
  message?: string;
  audioBlob?: boolean;
};

export const useChatSubmit = (
  reset: UseFormReset<FormData>,
  clearErrors: UseFormClearErrors<FormData>,
  setFetchError: (error: string | null) => void,
) => {
  const { recordedBlob, stopRecordingAndReturnBlob } = useContext(AudioInputContext);

  const onSubmit = useCallback(
    async (data: FormData) => {
      setFetchError(null);

      try {
        const formData = new FormData();
        formData.append('personalityId', data.personalityId);

        let apiUrl = '/api/generate/response';
        let blobToSubmit = recordedBlob;

        if (!recordedBlob && data.audioBlob) {
          blobToSubmit = await stopRecordingAndReturnBlob();
        }

        if (blobToSubmit) {
          const withCorrectSampleRate = await convertSampleRate(blobToSubmit);
          const asF32 = convertAudioBufferToFloat32(withCorrectSampleRate);
          const floatBlob = new Blob([asF32.buffer], { type: 'application/octet-stream' });
          formData.append('audioData', floatBlob, 'audio.f32');
          apiUrl = '/api/generate/speech-to-text';
        } else {
          formData.append('message', data.message || '');
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const body = await response.text();
          setFetchError(`Error generating response: ${response.statusText}\n${body}`);
        } else {
          const json = await response.json();

          return json;
        }
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : String(error));
      } finally {
        reset((formValues) => ({ ...formValues, message: '' }), { keepErrors: false, keepDirty: false });
        clearErrors(['message']);
      }
    },
    [reset, clearErrors, setFetchError, recordedBlob, stopRecordingAndReturnBlob],
  );

  return { onSubmit };
};
