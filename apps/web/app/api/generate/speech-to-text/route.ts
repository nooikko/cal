import { type AutomaticSpeechRecognitionOutput, pipeline } from '@xenova/transformers';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get('audioData') as Blob;

    if (!audioBlob) {
      return NextResponse.json({ error: 'audioBlob (raw Float32) is required' }, { status: 400, statusText: 'Bad Request' });
    }

    const arrayBuffer = await audioBlob.arrayBuffer();
    const float32Data = new Float32Array(arrayBuffer);

    const asrPipeline = await pipeline('automatic-speech-recognition', 'distil-whisper/distil-large-v3', {
      quantized: true,
      progress_callback: undefined,
      config: null,
      cache_dir: undefined,
      local_files_only: false,
      revision: 'main',
    });

    const result = (await asrPipeline(float32Data)) as AutomaticSpeechRecognitionOutput;

    return NextResponse.json({ transcription: result.text.trim() }, { status: 201, statusText: 'Created' });
  } catch (err) {
    console.error('ASR route error:', err);
    return NextResponse.json({ error: (err as Error)?.message ?? String(err) }, { status: 500, statusText: 'Internal Server Error' });
  }
};
