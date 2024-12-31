import { convertOpusToAudioBuffer } from '../helpers/opus-to-audio-buffer';

/**
 * Converts the sample rate of an audio Blob to 16000 Hz.
 *
 * @param blob - The audio Blob to be converted.
 * @returns A promise that resolves to an AudioBuffer with a sample rate of 16000 Hz.
 * @throws Will throw an error if the sample rate of the input audio is less than 16000 Hz.
 */
export const convertSampleRate = async (blob: Blob): Promise<AudioBuffer> => {
  const buffer = await convertOpusToAudioBuffer(blob);

  if (buffer.sampleRate === 16000) {
    return buffer;
  }

  if (buffer.sampleRate < 16000) {
    throw new Error('Sample rate is too low');
  }

  const offlineContext = new OfflineAudioContext(buffer.numberOfChannels, buffer.duration * 16000, 16000);

  const source = offlineContext.createBufferSource();
  source.buffer = buffer;
  source.connect(offlineContext.destination);
  source.start(0);

  const downsampled = await offlineContext.startRendering();

  return downsampled;
};
