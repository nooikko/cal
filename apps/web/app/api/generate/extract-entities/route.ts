import { pipeline } from '@xenova/transformers';
import { type NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const { input } = await request.json();

    const tokenPipeline = await pipeline('token-classification', 'Xenova/bert-base-NER', {
      quantized: true,
      progress_callback: undefined,
      config: null,
      cache_dir: undefined,
      local_files_only: false,
      revision: 'main',
    });

    const result = await tokenPipeline(input);

    return NextResponse.json({ entities: result }, { status: 201, statusText: 'Created' });
  } catch (err) {
    console.error('ASR route error:', err);
    return NextResponse.json({ error: (err as Error)?.message ?? String(err) }, { status: 500, statusText: 'Internal Server Error' });
  }
};
