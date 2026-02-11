<script lang="ts">
	import Fa from 'svelte-fa';
	import {
		faTachometerAlt,
		faGraduationCap,
		faArrowRight
	} from '@fortawesome/free-solid-svg-icons';
	import { resolve } from '$app/paths';

	export interface QuizQuestion {
		question: string;
		options: string[];
		answer: string;
	}

	let topic = '';
	let count: number | string = 3;
	let loading = false;
	let error = '';
	let quizData: QuizQuestion[] = [];
	let answers: Record<number, string> = {};
	let results: {
		questionIndex: number;
		question: string;
		correctAnswer: string;
		userAnswer: string;
		isCorrect: boolean;
	}[] = [];
	let submitted = false;
	let score = { correct: 0, total: 0, percentage: 0 };

	async function generateQuiz(e?: Event) {
		e?.preventDefault();
		error = '';
		results = [];
		submitted = false;
		if (!topic.trim()) {
			error = 'Please enter a topic.';
			return;
		}
		loading = true;
		try {
			const res = await fetch('/api/quiz', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ topic, count: Number(count) })
			});
			if (!res.ok) {
				const text = await res.text();
				throw new Error(text || `Server error: ${res.status}`);
			}
			const data = await res.json();
			quizData = data.quizData ?? [];
			answers = {};
		} catch (err: any) {
			error = err?.message ?? 'Failed to generate quiz.';
		} finally {
			loading = false;
		}
	}

	function submitQuiz(e?: Event) {
		e?.preventDefault();
		if (!quizData.length) {
			error = 'No quiz to submit.';
			return;
		}
		results = quizData.map((q, i) => {
			const user = answers[i] ?? '';
			return {
				questionIndex: i,
				question: q.question,
				correctAnswer: q.answer,
				userAnswer: user,
				isCorrect: user === q.answer
			};
		});
		const correct = results.filter((r) => r.isCorrect).length;
		score = {
			correct,
			total: quizData.length,
			percentage: Math.round((correct / quizData.length) * 100)
		};
		submitted = true;
	}

	function resetQuiz() {
		topic = '';
		quizData = [];
		answers = {};
		results = [];
		submitted = false;
		error = '';
	}
</script>

<header>
	<div>
		<Fa icon={faTachometerAlt} />
		<span>Powered by Gemini</span>
	</div>
	<h1>Study smarter,<br /><em>not harder.</em></h1>
	<p>
		ClasslyAI generates personalized study material, quizzes, and performance analytics — all driven
		by AI so you can focus on actually learning.
	</p>
	<nav>
		<a href={resolve('/dashboard')}>Get Started <Fa icon={faArrowRight} /></a>
		<a href={resolve('/about')}>Learn More</a>
	</nav>
</header>

<main>
	<section aria-labelledby="quiz-intro">
		<h2 id="quiz-intro">Generate a quiz</h2>
		<form on:submit|preventDefault={generateQuiz}>
			<label for="topic">Topic</label>
			<input id="topic" name="topic" type="text" bind:value={topic} required />

			<label for="count">Number of questions</label>
			<input id="count" name="count" type="number" min="1" max="20" bind:value={count} />

			<button type="submit" disabled={loading}>{loading ? 'Generating…' : 'Generate Quiz'}</button>
			<button type="button" on:click={resetQuiz}>Reset</button>
		</form>

		{#if error}
			<p role="alert">{error}</p>
		{/if}
	</section>

	{#if quizData.length}
		<section aria-labelledby="quiz-section">
			<h2 id="quiz-section">Quiz</h2>
			<form on:submit|preventDefault={submitQuiz}>
				<ol>
					{#each quizData as q, i}
						<li>
							<article>
								<p><strong>Q{i + 1}.</strong> {q.question}</p>
								<fieldset>
									<legend>Choices</legend>
									{#each q.options as opt}
										<div>
											<input
												type="radio"
												id={`q${i}-${opt.slice(0, 1)}`}
												name={`q${i}`}
												value={opt.slice(0, 1)}
												checked={answers[i] === opt.slice(0, 1)}
												on:change={() => {
													answers[i] = opt.slice(0, 1);
													answers = { ...answers };
												}}
											/>
											<label for={`q${i}-${opt.slice(0, 1)}`}>{opt}</label>
										</div>
									{/each}
								</fieldset>
							</article>
						</li>
					{/each}
				</ol>

				<button type="submit">Submit Answers</button>
			</form>
		</section>
	{/if}

	{#if submitted}
		<section aria-labelledby="results-section">
			<h2 id="results-section">Results</h2>
			<p>You scored {score.correct} out of {score.total} ({score.percentage}%)</p>
			<ol>
				{#each results as r}
					<li>
						<p><strong>Q{r.questionIndex + 1}.</strong> {r.question}</p>
						<p>
							Your answer: {r.userAnswer || 'No answer selected'} — {r.isCorrect
								? 'Correct'
								: `Incorrect (Correct: ${r.correctAnswer})`}
						</p>
					</li>
				{/each}
			</ol>
		</section>
	{/if}
</main>

<footer>
	<Fa icon={faGraduationCap} />
	<h2>Ready to level up?</h2>
	<p>Jump into your dashboard and start your first AI study session.</p>
	<a href={resolve('/dashboard')}>Open Dashboard <Fa icon={faArrowRight} /></a>
</footer>
