import { AutoModel, AutoTokenizer } from '@xenova/transformers';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { audio } = (await request.json()) as { audio: Blob };

  if (!audio) {
    return NextResponse.json({ error: 'Audio file is required' }, { status: 400, statusText: 'Bad Request' });
  }

  // Process the audio Blob here
  const tokenizer = await AutoTokenizer.from_pretrained('openai/whisper-large-v3', {
    quantized: true,
    progress_callback: undefined,
    config: null,
    cache_dir: undefined,
    local_files_only: false,
    revision: 'main',
  });

  const model = await AutoModel.from_pretrained('openai/whisper-large-v3', {
    quantized: true,
    progress_callback: undefined,
    config: null,
    cache_dir: undefined,
    local_files_only: false,
    revision: 'main',
  });

  const inputs = tokenizer(audio, {
    return_tensors: 'pt',
    padding: 'longest',
    truncation: true,
  });

  const outputs = await model.generate(inputs);

  return NextResponse.json({ transcription: outputs }, { status: 201, statusText: 'Created' });
};
