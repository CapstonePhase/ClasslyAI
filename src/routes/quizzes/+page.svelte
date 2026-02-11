<script lang="ts">
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Card from '$lib/components/Card.svelte';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Table from '$lib/components/Table.svelte';
	import { faClock } from '@fortawesome/free-solid-svg-icons';
	import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let { form } = $props();
	// UI state for history sorting and export
	const CHEVRON = 'M6 9l6 6 6-6';
	const PLUS = 'M12 5v14M5 12h14';
	const TRASH = 'M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4h4v2';
	let sortBy = $state<'date' | 'score' | 'topic'>('date');
	let sortDir = $state<'desc' | 'asc'>('desc');
	let sortOpen = $state(false);
	let searchQuery = $state('');

	function sortLabel(key: string) {
		if (key === 'date') return 'Date';
		if (key === 'score') return 'Score';
		return 'Topic';
	}

	function exportHistory() {
		if (quizHistory.length === 0) return;
		const blob = new Blob([JSON.stringify(quizHistory, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'quiz-history.json';
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	function clearHistory() {
		if (quizHistory.length === 0) return;
		const ok = confirm('Clear all quiz history? This cannot be undone.');
		if (!ok) return;
		quizHistory = [];
	}

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

	const filteredHistory = $derived.by(() => {
		let result = quizHistory;
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(entry) =>
					entry.topic.toLowerCase().includes(q) ||
					entry.date.toLowerCase().includes(q) ||
					`${entry.score}/${entry.total}`.includes(q)
			);
		}
		return result;
	});

	// Stable reference — NOT recreated on every render
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

<!-------- HTML -------->

<section class="quiz-page">
	<header class="section section-center hero dash-hero">
		<div class="hero-badge">
			<Fa icon={faTachometerAlt} />
			<span>Study Dashboard</span>
		</div>
		<h1>Your <em>Dashboard</em></h1>
		<p class="subtitle">Overview of your classes, media, and tasks — all in one place.</p>
	</header>

	<MenuBar method="POST" action="?/generate" enhance={handleEnhance} class="generate-form">
		{#snippet children()}
			<input
				name="topic"
				type="text"
				placeholder="e.g. Photosynthesis, World War II, Linear Algebra…"
				value={form?.topic ?? ''}
				required
				disabled={loading}
			/>
		{/snippet}

		{#snippet actions()}
			<div>
				<button type="submit" class="btn btn-primary" disabled={loading}>
					{#if loading}Generating…{:else}Generate Quiz{/if}
				</button>
			</div>
		{/snippet}
	</MenuBar>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if questions.length > 0}
		<!-- Tabs -->
		<ul class="tabs">
			<li>
				<button
					class="tab"
					class:active={activeTab === 'questions'}
					onclick={() => (activeTab = 'questions')}
				>
					Questions
				</button>
			</li>
			<li>
				<button
					class="tab"
					class:active={activeTab === 'results'}
					disabled={!submitted}
					onclick={() => (activeTab = 'results')}
				>
					Results
				</button>
			</li>
		</ul>

		<!-- Questions tab -->
		{#if activeTab === 'questions'}
			<form method="POST" action="?/submit" use:enhance={handleEnhance}>
				<input type="hidden" name="questions" value={JSON.stringify(questions)} />
				<input type="hidden" name="answers" value={JSON.stringify(selectedAnswers)} />

				{#each questions as q, i (q.question)}
					<Card title={`Question ${i + 1}`}>
						{#snippet content()}
							<p class="question-text">{q.question}</p>
							<ul class="options">
								{#each q.options as option (option)}
									{@const letter = option.charAt(0)}
									<li>
										<label class="option-label" class:selected={selectedAnswers[i] === letter}>
											<input
												type="radio"
												name={`q${i}`}
												value={letter}
												checked={selectedAnswers[i] === letter}
												onchange={() => (selectedAnswers[i] = letter)}
											/>
											{option}
										</label>
									</li>
								{/each}
							</ul>
						{/snippet}
					</Card>
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

		<!-- Results tab -->
		{#if activeTab === 'results' && submitted && score}
			<div class="score-summary">
				<h2>{score.percentage}%</h2>
				<p>{score.correct} / {score.total} correct</p>
			</div>

			{#each results as r, i (r.questionIndex)}
				<Card title={`Question ${i + 1}`}>
					{#snippet content()}
						<p class="question-text">{r.question}</p>
						<p class="result-answer" class:correct={r.isCorrect} class:wrong={!r.isCorrect}>
							Your answer: {r.userAnswer || '(none)'} — {r.isCorrect
								? '✅ Correct'
								: `❌ Correct answer: ${r.correctAnswer}`}
						</p>
					{/snippet}
				</Card>
			{/each}
		{/if}
	{/if}

	<!-- History Dropdown and List -->
	<section class="section">
		<details class="dropdown history-dropdown">
			<summary class="btn btn-ghost history-summary">
				<span class="icon-accent"
					><Icon path={faClock.iconName ? faClock.iconName : CHEVRON} size={14} /></span
				>
				<strong>History</strong>
				<span class="text-muted history-count">{filteredHistory.length} quizzes</span>
			</summary>

			<div class="dropdown-panel history-panel">
				<div class="history-controls">
					<search class="search-field">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
						</svg>
						<input
							class="input"
							type="search"
							placeholder="Search quizzes..."
							bind:value={searchQuery}
						/>
					</search>

					<div class="history-actions">
						<details class="dropdown" bind:open={sortOpen}>
							<summary
								class="btn btn-ghost"
								onclick={(e) => {
									e.preventDefault();
									sortOpen = !sortOpen;
								}}
							>
								Sort: {sortLabel(sortBy)}
								<Icon path={CHEVRON} size={10} />
							</summary>
							<div class="dropdown-panel">
								<button
									class="dropdown-item"
									onclick={() => {
										sortBy = 'date';
										sortOpen = false;
									}}>Date</button
								>
								<button
									class="dropdown-item"
									onclick={() => {
										sortBy = 'score';
										sortOpen = false;
									}}>Score</button
								>
								<button
									class="dropdown-item"
									onclick={() => {
										sortBy = 'topic';
										sortOpen = false;
									}}>Topic</button
								>
								<hr />
								<button
									class="dropdown-item"
									onclick={() => {
										sortDir = sortDir === 'asc' ? 'desc' : 'asc';
									}}>Direction: {sortDir}</button
								>
							</div>
						</details>
						<button
							class="icon-btn danger"
							onclick={clearHistory}
							aria-label="Clear history"
							title="Clear history"
							disabled={quizHistory.length === 0}
						>
							<Icon path={TRASH} size={14} />
						</button>
						<button
							class="icon-btn"
							aria-label="Export history"
							onclick={exportHistory}
							disabled={quizHistory.length === 0}
							title="Export history"
						>
							<Icon path={PLUS} size={14} />
						</button>
					</div>
				</div>

				<div class="data-card">
					{#if filteredHistory.length > 0}
						<Table
							columns={[
								{ key: 'score', label: 'Score', sortable: true, align: 'left', width: '80px' },
								{ key: 'topic', label: 'Topic', sortable: true },
								{ key: 'result', label: 'Result', sortable: false },
								{ key: 'date', label: 'Date', sortable: true, align: 'right', width: '140px' }
							]}
							data={filteredHistory as unknown as Record<string, unknown>[]}
							selectable
							paginated
							pageSize={5}
						>
							{#snippet cell({ row, column, value }: { row: any; column: any; value: unknown })}
								{#if column.key === 'score'}
									<span
										class="badge"
										class:success={(row.score / row.total) * 100 >= 80}
										class:muted={(row.score / row.total) * 100 < 80}
									>
										<span class="badge-dot"></span>
										{Math.round((row.score / row.total) * 100)}%
									</span>
								{:else if column.key === 'result'}
									<span>{row.score}/{row.total}</span>
								{:else if column.key === 'topic'}
									<strong>{value}</strong>
								{:else}
									{value ?? ''}
								{/if}
							{/snippet}
						</Table>
					{:else}
						<p class="empty-state">No quizzes taken yet. Generate one above to get started!</p>
					{/if}
				</div>
			</div>
		</details>
	</section>
</section>

<style>
	.quiz-page {
		max-width: 700px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h1 {
		font-size: 1.8rem;
		font-weight: 800;
		margin-bottom: 1.5rem;
	}

	.error {
		color: #ef4444;
		margin-bottom: 1rem;
	}

	/* Tabs */
	.tabs {
		list-style: none;
		display: flex;
		gap: 0.5rem;
		padding: 0;
		margin-bottom: 1.5rem;
	}
	.tab {
		padding: 0.5rem 1.2rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		font: inherit;
		font-weight: 600;
	}
	.tab.active {
		background: var(--accent);
		color: #fff;
		border-color: var(--accent);
	}
	.tab:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* Questions */
	.question-text {
		font-weight: 500;
		margin-bottom: 0.75rem;
	}
	.options {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.option-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		border: 1px solid var(--border);
		cursor: pointer;
		transition: background var(--transition-speed);
	}
	.option-label:hover {
		background: var(--surface);
	}
	.option-label.selected {
		border-color: var(--accent);
		background: var(--surface);
	}
	.option-label input[type='radio'] {
		accent-color: var(--accent);
	}

	.submit-btn {
		margin-top: 1.5rem;
		width: 100%;
		justify-content: center;
	}
	.submit-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Results */
	.score-summary {
		text-align: center;
		margin-bottom: 1.5rem;
	}
	.score-summary h2 {
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--accent);
	}
	.score-summary p {
		color: var(--text-muted);
	}
	.result-answer {
		padding: 0.5rem 0.75rem;
		border-radius: 8px;
		font-weight: 500;
	}
	.result-answer.correct {
		background: rgba(34, 197, 94, 0.1);
		color: #16a34a;
	}
	.result-answer.wrong {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	/* History Dropdown */
	.history-dropdown {
		border: none;
		padding: 0;
	}

	.history-summary {
		background: transparent !important;
		border: none !important;
		box-shadow: none !important;
		transition: none !important;
	}

	.history-summary:hover {
		background: transparent !important;
		box-shadow: none !important;
	}

	.history-panel {
		padding: 1rem;
		border: none;
		box-shadow: none;
		background: transparent;
	}

	.history-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.history-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto;
	}

	.search-field {
		width: 200px;
		position: static;
		transform: none;
	}

	@media (max-width: 640px) {
		.history-controls {
			flex-direction: column;
			align-items: stretch;
		}
		.history-actions {
			margin-left: 0;
			justify-content: flex-end;
		}
		.search-field {
			width: 100%;
		}
	}
</style>
