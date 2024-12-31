'use client';
import { type PropsWithChildren, createContext, useCallback } from 'react';
import { useVoiceVisualizer } from 'react-voice-visualizer';
import type { Controls } from '../../../../../node_modules/react-voice-visualizer/dist/types/types.d.ts';

// Create a Context for the Voice Visualizer
// Extend Controls to include stopRecordingAndReturnBlob
export interface ExtendedControls extends Controls {
  stopRecordingAndReturnBlob: () => Promise<Blob | null>;
}

// Create the AudioInputContext with default values
export const AudioInputContext = createContext<ExtendedControls>({
  audioRef: { current: null },
  isRecordingInProgress: false,
  isPausedRecording: false,
  audioData: new Uint8Array(0),
  recordingTime: 0,
  mediaRecorder: null,
  duration: 0,
  currentAudioTime: 0,
  audioSrc: '',
  isPausedRecordedAudio: false,
  isProcessingRecordedAudio: false,
  isCleared: false,
  isAvailableRecordedAudio: false,
  recordedBlob: null,
  bufferFromRecordedBlob: null,
  formattedDuration: '',
  formattedRecordingTime: '',
  formattedRecordedAudioCurrentTime: '',
  startRecording: () => {},
  togglePauseResume: () => {},
  stopRecording: () => {},
  saveAudioFile: () => {},
  clearCanvas: () => {},
  setCurrentAudioTime: () => {},
  error: null,
  isProcessingOnResize: false,
  isProcessingStartRecording: false,
  isPreloadedBlob: false,
  setPreloadedAudioBlob: () => {},
  _setIsProcessingAudioOnComplete: () => {},
  _setIsProcessingOnResize: () => {},
  stopRecordingAndReturnBlob: async () => null, // Default method
});

// Provider component
export const AudioInputProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const recorderControls = useVoiceVisualizer();

  const startRecording = useCallback(() => {
    recorderControls.startRecording();
  }, [recorderControls]);

  const stopRecordingAndReturnBlob = useCallback(async () => {
    return new Promise<Blob | null>((resolve) => {
      if (recorderControls.isRecordingInProgress) {
        recorderControls.mediaRecorder?.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0) {
            resolve(event.data);
          } else {
            resolve(null);
          }
        });
        recorderControls.stopRecording();
      } else {
        resolve(null);
      }
    });
  }, [recorderControls]);

  // Merge additional logic with existing recorder controls
  const extendedControls: ExtendedControls = {
    ...recorderControls,
    startRecording,
    stopRecordingAndReturnBlob,
  };

  return <AudioInputContext.Provider value={extendedControls}>{children}</AudioInputContext.Provider>;
};

export default AudioInputContext;
