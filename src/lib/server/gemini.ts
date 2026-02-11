import { env } from '$env/dynamic/private';
import { GoogleGenAI } from '@google/genai';

function getGemini() {
	const apiKey = env.GEMINI_API_KEY;;
	if (!apiKey) {
		throw new Error('GEMINI_API_KEY is not set. Add it to your .env file.');
	}
	return new GoogleGenAI({ apiKey });
}

/**
 * Send a prompt to Gemini and return the raw text response.
 *
 *
 */
export async function generateText(prompt: string): Promise<string> {
	const gemini = getGemini();
	const response = await gemini.models.generateContent({
		model: 'gemini-3-flash-preview',
		contents: prompt
	});
	if (!response.text) {
		throw new Error('Gemini didnt return a response');
	}
	return response.text;
}

generateText('photosynthesis');

/**
 * Send a prompt to Gemini and parse the response as JSON.
 * Strips markdown fences if Gemini wraps the output in ```json … ```.
 */
export async function generateJSON<JSON>(prompt: string): Promise<JSON> {
	const text = await generateText(prompt);
	const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
	return JSON.parse(cleaned);
}
