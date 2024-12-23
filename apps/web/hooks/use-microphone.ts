import { useRef, useState, useCallback, useMemo } from "react";

interface TranscriptionResponse {
  transcription: string;
}

export const useMicrophone = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const clearError = useCallback(() => setError(null), []);

  const initializeMediaRecorder = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      return mediaRecorder;
    } catch (err) {
      setError(new Error(`MICROPHONE_ERROR: ${err instanceof Error ? err.message : "Failed to initialize microphone"}`));
      return null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    clearError();
    const mediaRecorder = await initializeMediaRecorder();
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
    }
  }, [clearError, initializeMediaRecorder]);

  const createAudioBlob = useCallback(() => {
    return new Blob(audioChunksRef.current, { type: "audio/webm" });
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");

    try {
      const response = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        body: formData,
      });
      const data: TranscriptionResponse = await response.json();

      if (!data.transcription) {
        setError(new Error("TRANSCRIPTION_ERROR: No transcription received from the server"));
        return "";
      }

      return data.transcription;
    } catch (err) {
      setError(new Error(`TRANSCRIPTION_ERROR: ${err instanceof Error ? err.message : "Failed to transcribe audio"}`));
      return "";
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.addEventListener("stop", async () => {
      const audioBlob = createAudioBlob();
      const transcription = await transcribeAudio(audioBlob);
      setTranscript(transcription);
      setIsRecording(false);
    });
  }, [createAudioBlob, transcribeAudio]);

  return useMemo(() => ({
    isRecording,
    transcript,
    error,
    clearError,
    startRecording,
    stopRecording,
  }), [isRecording, transcript, error, clearError, startRecording, stopRecording]);
};
