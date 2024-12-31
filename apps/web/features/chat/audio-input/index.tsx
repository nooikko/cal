'use client';
import { useContext, useEffect } from 'react';
import { VoiceVisualizer } from 'react-voice-visualizer';
import { AudioInputContext } from './context';

/**
 * AudioInput component that uses the VoiceVisualizer to record and visualize audio input.
 */
export const AudioInput = () => {
  const controls = useContext(AudioInputContext);

  // Effect to handle errors
  useEffect(() => {
    if (!controls.error) return;

    console.error(controls.error);
  }, [controls.error]);

  return (
    <div>
      {controls.isRecordingInProgress && (
        <VoiceVisualizer
          width='100%'
          controls={controls}
          controlButtonsClassName='hidden'
          isDownloadAudioButtonShown={false}
          isControlPanelShown={false}
        />
      )}
    </div>
  );
};
