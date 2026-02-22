import { fail } from '@sveltejs/kit';
import { generateJSON } from '$lib/server/gemini';
import type { Actions } from './$types';

export interface QuizQuestion {
	question: string;
	options: string[];
	answer: string;
}

let lastGenerateTime = 0;
const MIN_INTERVAL_MS = 10_000; // at least 10 seconds between API calls

export const actions = {
	generate: async ({ request }) => {
		const now = Date.now();
		if (now - lastGenerateTime < MIN_INTERVAL_MS) {
			const waitSec = Math.ceil((MIN_INTERVAL_MS - (now - lastGenerateTime)) / 1000);
			console.warn(`Rate limiter: blocked duplicate call. Wait ${waitSec}s.`);
			return fail(429, {
				error: `Too many requests. Please wait ${waitSec} seconds before trying again.`,
				topic: ''
			});
		}
		lastGenerateTime = now;

		const questions = await request.formData();
		const topic = questions.get('topic');

		// checking user input
		if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
			return fail(400, { error: 'Please enter a topic.', topic: '' });
		}

		const prompt = `Generate 3 multiple choice questions about "${topic}".
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
			return { success: true, quizData, topic };
		} catch (err) {
			console.error('Gemini quiz generation error:', err);
			return fail(500, {
				error: 'Failed to generate quiz. Please try again.',
				topic: topic as string
			});
		}
	},

	submit: async ({ request }) => {
		const submition = await request.formData();
		const questionsRaw = submition.get('questions');
		const answersRaw = submition.get('answers');

		if (!questionsRaw || !answersRaw) {
			return fail(400, { error: 'Missing quiz data.' });
		}

		try {
			const questions: QuizQuestion[] = JSON.parse(questionsRaw as string);
			const answers: Record<number, string> = JSON.parse(answersRaw as string);

			const results = questions.map((quiz, index) => {
				const userAnswer = answers[index] ?? '';
				return {
					questionIndex: index,
					question: quiz.question,
					correctAnswer: quiz.answer,
					userAnswer,
					isCorrect: userAnswer === quiz.answer
				};
			});

			const correct = results.filter((result) => result.isCorrect).length;

			return {
				success: true,
				submitted: true,
				results,
				score: {
					correct,
					total: questions.length,
					percentage: Math.round((correct / questions.length) * 100)
				}
			};
		} catch {
			return fail(500, { error: 'Failed to grade quiz.' });
		}
	}
} satisfies Actions;
