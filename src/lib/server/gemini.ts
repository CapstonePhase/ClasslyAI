import { env } from '$env/dynamic/private';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = 'gemini-2.0-flash';

function getGemini() {
	const key = env.GEMINI_API_KEY;
	if (!key || key === 'your_key_here') {
		throw new Error('GEMINI_API_KEY is not set. Add it to your .env file.');
	}
	return new GoogleGenerativeAI(key);
}

/**
 * Send a prompt to Gemini and return the raw text response.
 */
export async function generateText(prompt: string): Promise<string> {
	const gemini = getGemini();
	const model = gemini.getGenerativeModel({ model: MODEL });
	const result = await model.generateContent(prompt);
	return result.response.text();
}

/**
 * Send a prompt to Gemini and parse the response as JSON.
 * Strips markdown fences if Gemini wraps the output in ```json … ```.
 */
export async function generateJSON<T = unknown>(prompt: string): Promise<T> {
	const text = await generateText(prompt);
	const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
	return JSON.parse(cleaned) as T;
}
