import type { UseFormClearErrors, UseFormReset } from 'react-hook-form';

type FormData = {
  message: string;
  personalityId: string;
};

export const useChatSubmit = (
  reset: UseFormReset<FormData>,
  clearErrors: UseFormClearErrors<FormData>,
  setFetchError: (error: string | null) => void,
) => {
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

  return { onSubmit };
};
