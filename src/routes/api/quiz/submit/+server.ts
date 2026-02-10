import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface SubmitBody {
	questions: {
		question: string;
		options: string[];
		answer: string;
	}[];
	answers: Record<number, string>;
}

export interface GradeResult {
	questionIndex: number;
	question: string;
	correctAnswer: string;
	userAnswer: string;
	isCorrect: boolean;
}

export const POST: RequestHandler = async ({ request }) => {
	const body: SubmitBody = await request.json();
	const { questions, answers } = body;

	if (!questions || !answers) {
		error(400, 'Missing required fields: questions, answers');
	}

	const results: GradeResult[] = questions.map((q, i) => {
		const userAnswer = answers[i] ?? '';
		return {
			questionIndex: i,
			question: q.question,
			correctAnswer: q.answer,
			userAnswer,
			isCorrect: userAnswer === q.answer
		};
	});

	const correct = results.filter((r) => r.isCorrect).length;

	return json({
		success: true,
		results,
		score: {
			correct,
			total: questions.length,
			percentage: Math.round((correct / questions.length) * 100)
		}
	});
};
