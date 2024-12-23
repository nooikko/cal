import type internal from 'node:stream';
import type { NextResponse } from 'next/server';

export enum ElevenLabsModel {
  MULTILINGUAL_V2 = 'eleven_multilingual_v2',
  FLASH_V2_5 = 'eleven_flash_v2_5',
  FLASH_V2 = 'eleven_flash_v2',
}

export interface TextToSpeechRequestData {
  voice?: string;
  text: string;
  model_id?: ElevenLabsModel;
}

export type TextToSpeechResponseData = Promise<
  | NextResponse<{
      error: string;
    }>
  | NextResponse<{
      message: string;
      data: internal.Readable;
    }>
>;
