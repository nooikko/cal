/**
 * Converts a given WebM Blob containing Opus audio data into an AudioBuffer.
 *
 * @param blob - The Blob containing the WebM Opus audio data to be converted.
 * @returns A promise that resolves to an AudioBuffer containing the decoded audio data.
 */
export const convertOpusToAudioBuffer = async (blob: Blob): Promise<AudioBuffer> => {
  const audioContext = new AudioContext();
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  return audioBuffer;
};
