import { json, error } from '@sveltejs/kit';
import { generateJSON } from '$lib/server/gemini';
import type { RequestHandler } from './$types';

export interface QuizQuestion {
	question: string;
	options: string[];
	answer: string;
}

let lastCallTime = 0;
const MIN_INTERVAL_MS = 10_000;

export const POST: RequestHandler = async ({ request }) => {
	const now = Date.now();
	if (now - lastCallTime < MIN_INTERVAL_MS) {
		error(429, 'Too many requests. Please wait before trying again.');
	}
	lastCallTime = now;

	const body = await request.json();
	const topic = body.topic;
	const count = body.count ?? 5;

	if (!topic || typeof topic !== 'string') {
		error(400, 'Missing required field: topic');
	}

	const prompt = `Generate ${count} multiple choice questions about "${topic}".
Each question should have exactly 4 options labeled A, B, C, D.
Return ONLY valid JSON in this exact format:
[
  {
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "answer": "A"
  }
]`;

	try {
		const quizData = await generateJSON<QuizQuestion[]>(prompt);
		return json({ success: true, quizData });
	} catch (err) {
		console.error('Gemini quiz error:', err);
		error(500, 'Failed to generate quiz questions');
	}
};
