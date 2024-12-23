import { NextResponse, type NextRequest } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { error } from "@repo/logger";
import { type TextToSpeechRequestData, ElevenLabsModel } from "./_types";

/**
 * Handles POST requests to generate a voice using the ElevenLabs API.
 *
 * @param request - The incoming request object.
 * @returns The response object containing the generated voice data or an error message.
 *
 * @throws If there is an issue with generating the voice.
 *
 * @remarks
 * This function expects the following environment variable to be set:
 * - `ELEVENLABS_API_KEY`: The API key for accessing the ElevenLabs API.
 *
 * The request body should contain the following optional fields:
 * - `voice`: The ID of the voice to use for generation (default is "default_voice_id").
 * - `model_id`: The ID of the model to use for generation (default is `ElevenLabsModel.FLASH_V2`).
 * - `text`: The text to be converted to voice (required).
 *
 * The response will contain a JSON object with either the generated voice data or an error message.
 */
export const POST = async (request: NextRequest) => {
	try {
		if (!process.env.ELEVENLABS_API_KEY) {
			return NextResponse.json({ error: "Missing ElevenLabs API key" });
		}

		const client = new ElevenLabsClient({
			apiKey: process.env.ELEVENLABS_API_KEY,
		});

		const requestBody: Partial<TextToSpeechRequestData> = await request.json();

		const voice = requestBody.voice ?? "Sarah";
		const model_id = requestBody.model_id ?? ElevenLabsModel.FLASH_V2;
		const text = requestBody.text;

		if (!text) {
			return NextResponse.json(
				{ error: "Missing required field: text" },
				{ status: 400, statusText: "Bad Request" },
			);
		}

		const generatedVoice = await client.generate({
			voice,
			text,
			model_id,
		});

		return NextResponse.json(
			{ message: "Voice generated successfully", data: generatedVoice },
			{ status: 200, statusText: "OK" },
		);
	} catch (e) {
		const err = e as Error;
		error("Error generating voice.", { err });
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500, statusText: "Internal Server Error" },
		);
	}
};
