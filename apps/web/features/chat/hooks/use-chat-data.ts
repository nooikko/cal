import type { Personality } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import type { UseFormReset } from 'react-hook-form';

type FormData = {
  personalityId: string;
  message?: string | undefined;
  audioBlob?: boolean;
};

export const useChatData = (reset: UseFormReset<FormData>) => {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [personalities, setPersonalities] = useState<Personality[]>([]);

  // Make fetchUserAndPersonalities stable with useCallback,
  // so it doesn't create a new function reference on each render.
  const fetchUserAndPersonalities = useCallback(async () => {
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
  }, [reset]); // <= depends only on `reset`.

  // Perform the fetch once on mount (or if the function ever changes).
  useEffect(() => {
    fetchUserAndPersonalities();
  }, [fetchUserAndPersonalities]);

  return {
    fetchError,
    setFetchError,
    personalities,
  };
};
