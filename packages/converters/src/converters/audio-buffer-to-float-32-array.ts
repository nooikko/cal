/**
 * Converts an AudioBuffer to a Float32Array with interleaved channel data.
 *
 * @param buffer - The AudioBuffer to convert.
 * @returns A Float32Array containing the interleaved audio data from all channels.
 * @throws Will throw an error if channel data is undefined.
 */
export const convertAudioBufferToFloat32 = (buffer: AudioBuffer): Float32Array => {
  const { numberOfChannels, length } = buffer;
  // Create one large Float32Array to hold data from all channels, interleaved
  const result = new Float32Array(length * numberOfChannels);

  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      // Write the sample from this channel into the interleaved array
      // The sample for each frame is repeated across channels in sequence

      if (!channelData[i] && channelData[i] !== 0) {
        throw new Error('Channel data is undefined');
      }

      result[i * numberOfChannels + channel] = channelData[i] ?? 0;
    }
  }

  return result;
};
