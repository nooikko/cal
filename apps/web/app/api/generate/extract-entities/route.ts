import { pipeline } from '@xenova/transformers';
import { parse } from 'chrono-node';
import { type NextRequest, NextResponse } from 'next/server';

export const GET = async (_request: NextRequest) => {
  try {
    // const { input } = await request.json();

    const tokenPipeline = await pipeline('token-classification', 'Xenova/bert-base-NER', {
      quantized: true,
      progress_callback: undefined,
      config: null,
      cache_dir: undefined,
      local_files_only: false,
      revision: 'main',
    });

    const input = 'Add an appointment with Doctor Smith to my calendar for tomorrow at 3pm';

    const entities = await tokenPipeline(input);
    const dates = parse(input);

    return NextResponse.json({ entities, dates }, { status: 201, statusText: 'Created' });
  } catch (err) {
    console.error('Entity extraction error:', err);
    return NextResponse.json({ error: (err as Error)?.message ?? String(err) }, { status: 500, statusText: 'Internal Server Error' });
  }
};
