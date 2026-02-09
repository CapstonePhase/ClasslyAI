<script lang="ts">
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Card from '$lib/components/Card.svelte';
	import Fa from 'svelte-fa';
	import { faClipboardQuestion, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

	let { form } = $props();

	let questions = $derived(form?.quizData ?? []);
	let results = $derived(form?.results ?? []);
	let score = $derived(form?.score ?? null);
	let submitted = $derived(form?.submitted ?? false);
	let error = $derived(form?.error ?? '');

	let selectedAnswers = $state<Record<number, string>>({});
	let activeTab = $state<'questions' | 'results'>('questions');
	let loading = $state(false);

	// Mock quiz history (replace with real data later)
	interface HistoryEntry {
		topic: string;
		score: number;
		total: number;
		date: string;
	}

	let quizHistory = $state<HistoryEntry[]>([
		{ topic: 'Photosynthesis', score: 3, total: 3, date: '2 hours ago' },
		{ topic: 'World War II', score: 2, total: 3, date: '5 hours ago' },
		{ topic: 'Linear Algebra', score: 1, total: 3, date: 'Yesterday' },
		{ topic: 'Organic Chemistry', score: 3, total: 3, date: '2 days ago' },
		{ topic: 'Shakespeare', score: 2, total: 3, date: '3 days ago' }
	]);

	function scoreClass(s: number, total: number): string {
		const pct = (s / total) * 100;
		if (pct >= 80) return 'good';
		if (pct >= 50) return 'okay';
		return 'poor';
	}

	// Add to history on submit
	$effect(() => {
		if (submitted && score) {
			const topic = form?.topic ?? 'Unknown';
			untrack(() => {
				quizHistory = [
					{ topic, score: score!.correct, total: score!.total, date: 'Just now' },
					...quizHistory
				];
			});
		}
	});

	// Reset selections
	$effect(() => {
		const hasQuestions = questions.length > 0;
		const isSubmitted = submitted;

		untrack(() => {
			if (hasQuestions && !isSubmitted) {
				selectedAnswers = {};
				activeTab = 'questions';
			}
			if (isSubmitted) {
				activeTab = 'results';
			}
		});
	});

	const handleEnhance: SubmitFunction = ({ cancel }) => {
		if (loading) {
			cancel();
			return;
		}
		loading = true;
		return async ({ update }) => {
			loading = false;
			await update({ reset: false, invalidateAll: false });
		};
	};
</script>

<!------ HTML ------>

{#snippet questionCard(q: { question: string; options: string[] }, i: number)}
	<Card title="Question {i + 1}">
		{#snippet content()}
			<p class="question-text">{q.question}</p>
			<fieldset class="fieldset-reset quiz-options">
				{#each q.options as option (option)}
					{@const letter = option.charAt(0)}
					<label class:selected={selectedAnswers[i] === letter}>
						<input
							type="radio"
							name="q{i}"
							value={letter}
							checked={selectedAnswers[i] === letter}
							onchange={() => (selectedAnswers[i] = letter)}
						/>
						{option}
					</label>
				{/each}
			</fieldset>
		{/snippet}
	</Card>
{/snippet}

{#snippet resultCard(
	r: { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean },
	i: number
)}
	<Card title="Question {i + 1}">
		{#snippet content()}
			<p class="question-text">{r.question}</p>
			<p class="result-feedback" class:correct={r.isCorrect} class:wrong={!r.isCorrect}>
				Your answer: {r.userAnswer || '(none)'} — {r.isCorrect
					? '✅ Correct'
					: `❌ Correct answer: ${r.correctAnswer}`}
			</p>
		{/snippet}
	</Card>
{/snippet}

<!-- Hero -->
<header class="section section-center hero">
	<div class="hero-badge">
		<Fa icon={faClipboardQuestion} />
		<span>AI-Powered Quizzes</span>
	</div>
	<h1>Test your <em>knowledge.</em></h1>
	<p class="subtitle">
		Enter any topic and get instant AI-generated quiz questions. Track your scores and watch
		yourself improve.
	</p>
</header>

<section class="section">
	<form class="generate-form" method="POST" action="?/generate" use:enhance={handleEnhance}>
		<input
			class="input"
			name="topic"
			type="text"
			placeholder="e.g. Photosynthesis, World War II, Linear Algebra…"
			value={form?.topic ?? ''}
			required
			disabled={loading}
		/>
		<button type="submit" class="btn btn-primary" disabled={loading}>
			{loading ? 'Generating…' : 'Generate Quiz'}
			{#if !loading}<Fa icon={faArrowRight} />{/if}
		</button>
	</form>

	{#if error}
		<p class="alert-error" role="alert">{error}</p>
	{/if}
</section>

{#if questions.length > 0}
	<section class="section">
		<nav class="tab-bar">
			<menu class="tab-list">
				<li>
					<button
						class:active={activeTab === 'questions'}
						onclick={() => (activeTab = 'questions')}
					>
						Questions
					</button>
				</li>
				<li>
					<button
						class:active={activeTab === 'results'}
						disabled={!submitted}
						onclick={() => (activeTab = 'results')}
					>
						Results
					</button>
				</li>
			</menu>
		</nav>

		{#if activeTab === 'questions'}
			<form class="quiz-form" method="POST" action="?/submit" use:enhance={handleEnhance}>
				<input type="hidden" name="questions" value={JSON.stringify(questions)} />
				<input type="hidden" name="answers" value={JSON.stringify(selectedAnswers)} />

				{#each questions as q, i (q.question)}
					{@render questionCard(q, i)}
				{/each}

				<button
					type="submit"
					class="btn btn-primary submit-btn"
					disabled={Object.keys(selectedAnswers).length < questions.length}
				>
					Submit Answers
				</button>
			</form>
		{/if}

		{#if activeTab === 'results' && submitted && score}
			<output class="score-display">
				<h2>{score.percentage}%</h2>
				<p class="text-muted">{score.correct} / {score.total} correct</p>
			</output>

			{#each results as r, i (r.questionIndex)}
				{@render resultCard(r, i)}
			{/each}
		{/if}
	</section>
{/if}

<section class="section">
	<h2 class="section-title">Recent Quizzes</h2>
	<div class="data-card">
		<div class="history-header">
			<span class="icon-accent"><Fa icon={faClock} /></span>
			<strong>History</strong>
			<span class="text-muted history-count">{quizHistory.length} quizzes</span>
		</div>
		{#if quizHistory.length > 0}
			<ul class="history-list">
				{#each quizHistory as entry (entry.topic + entry.date)}
					<li class="history-item">
						<span class="score-pill {scoreClass(entry.score, entry.total)}">
							{Math.round((entry.score / entry.total) * 100)}%
						</span>
						<div class="history-meta">
							<strong>{entry.topic}</strong>
							<span>{entry.score}/{entry.total} correct · {entry.date}</span>
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="empty-state">No quizzes taken yet. Generate one above to get started!</p>
		{/if}
	</div>
</section>

<!------ /HTML ------>

<style>
	/* Hero spacing */
	.hero {
		padding-top: 3rem;
		padding-bottom: 2rem;
	}

	/* Generate form layout */
	.generate-form {
		display: flex;
		gap: 0.75rem;
	}

	.generate-form .input {
		flex: 1;
	}

	/* Tab bar */
	.tab-bar {
		margin-bottom: 1.5rem;
	}

	/* Quiz form spacing */
	.quiz-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Question text */
	.question-text {
		font-weight: 500;
		margin-bottom: 0.75rem;
	}

	/* Submit full width */
	.submit-btn {
		width: 100%;
		justify-content: center;
	}

	/* History card header */
	.history-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
		font-size: 0.875rem;
	}

	.history-count {
		margin-left: auto;
		font-size: 0.75rem;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.generate-form {
			flex-direction: column;
		}
	}
</style>
