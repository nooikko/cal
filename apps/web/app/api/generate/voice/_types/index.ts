import type { NextResponse } from "next/server";
import type internal from "node:stream";

export enum ElevenLabsModel {
	MULTILINGUAL_V2 = "eleven_multilingual_v2",
	FLASH_V2_5 = "eleven_flash_v2_5",
	FLASH_V2 = "eleven_flash_v2",
}

export interface GenerateVoiceRequestData {
	voice?: string;
	text: string;
	model_id?: ElevenLabsModel;
}

export type GenerateVoiceResponseData = Promise<
	| NextResponse<{
			error: string;
	  }>
	| NextResponse<{
			message: string;
			data: internal.Readable;
	  }>
>;
