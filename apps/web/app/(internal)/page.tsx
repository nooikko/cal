"use client";
import { useMicrophone } from "@/hooks/use-microphone";
import React from "react";

export default function RecordAudioPage() {
	const { isRecording, transcript, startRecording, stopRecording } =
		useMicrophone();

	return (
		<div>
			<h1>Whisper Transcription (CPU, In-Memory)</h1>
			<button onClick={startRecording} type="button" disabled={isRecording}>
				Start
			</button>
			<button onClick={stopRecording} type="button" disabled={!isRecording}>
				Stop
			</button>

			{transcript && (
				<div>
					<h2>Transcription:</h2>
					<p>{transcript}</p>
				</div>
			)}
		</div>
	);
}
