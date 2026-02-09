<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Fa from 'svelte-fa';
	import {
		faChartLine,
		faClipboardQuestion,
		faBookOpen,
		faArrowRight,
		faRobot,
		faGraduationCap
	} from '@fortawesome/free-solid-svg-icons';

	const steps = [
		{
			title: 'Pick a topic',
			description: 'Type any subject — from calculus to constitutional law.'
		},
		{
			title: 'AI generates content',
			description: 'Gemini produces study guides and quiz questions on the fly.'
		},
		{
			title: 'Study & test yourself',
			description: 'Read the material, take quizzes, and review your results.'
		},
		{
			title: 'Track your growth',
			description: 'Analytics show your improvement session over session.'
		}
	];
</script>

<svelte:head>
	<title>ClasslyAI — AI-Powered Learning</title>
</svelte:head>

<!-- Hero -->
<section class="hero">
	<div class="hero-badge">
		<Fa icon={faRobot} />
		<span>Powered by Gemini</span>
	</div>
	<h1>Study smarter,<br /><em>not harder.</em></h1>
	<p class="subtitle">
		ClasslyAI generates personalized study material, quizzes, and performance analytics — all driven
		by AI so you can focus on actually learning.
	</p>
	<div class="hero-actions">
		<a href="/dashboard" class="btn btn-primary">
			Get Started
			<Fa icon={faArrowRight} />
		</a>
		<a href="/about" class="btn btn-ghost">Learn More</a>
	</div>
</section>

<!-- Features -->
<section class="features">
	<h2>Everything you need to ace it</h2>
	<div class="features-grid">
		<Card title="AI Study Material">
			{#snippet content()}
				<div class="feature-card-body">
					<span class="feature-icon"><Fa icon={faBookOpen} size="lg" /></span>
					<p>
						Enter any topic and get curated notes, summaries, and key concepts generated instantly
						by Gemini.
					</p>
				</div>
			{/snippet}
		</Card>

		<Card title="Smart Quizzes">
			{#snippet content()}
				<div class="feature-card-body">
					<span class="feature-icon"><Fa icon={faClipboardQuestion} size="lg" /></span>
					<p>
						Auto-generated quizzes tailored to your study material. Multiple choice, short answer —
						you name it.
					</p>
				</div>
			{/snippet}
		</Card>

		<Card title="Performance Analytics">
			{#snippet content()}
				<div class="feature-card-body">
					<span class="feature-icon"><Fa icon={faChartLine} size="lg" /></span>
					<p>
						Track your scores, spot weak areas, and watch your progress over time with clear visual
						breakdowns.
					</p>
				</div>
			{/snippet}
		</Card>
	</div>
</section>

<!-- How it works -->
<section class="how-it-works">
	<h2>How it works</h2>
	<ol class="steps">
		{#each steps as step, index}
			<li>
				<span class="step-num">{index + 1}</span>
				<div>
					<h3>{step.title}</h3>
					<p>{step.description}</p>
				</div>
			</li>
		{/each}
	</ol>
</section>

<!-- CTA -->
<section class="cta">
	<Fa icon={faGraduationCap} size="2x" />
	<h2>Ready to level up?</h2>
	<p>Jump into your dashboard and start your first AI study session.</p>
	<a href="/dashboard" class="btn btn-primary">
		Open Dashboard
		<Fa icon={faArrowRight} />
	</a>
</section>

<style>
	/* Shared section centering */
	.hero,
	.features,
	.how-it-works,
	.cta {
		max-width: 700px;
		margin: 0 auto;
		padding: 0 1rem;
	}
	.hero,
	.cta {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.hero {
		padding-top: 4rem;
		padding-bottom: 3rem;
	}
	.cta {
		padding-top: 3rem;
		padding-bottom: 4rem;
		gap: 0.75rem;
	}

	section + section {
		margin-top: 3.5rem;
	}
	h2 {
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
		margin-bottom: 2rem;
	}

	/* Hero */
	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		color: var(--accent);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.3rem 0.85rem;
		margin-bottom: 1.5rem;
	}
	h1 {
		font-size: clamp(2.2rem, 5vw, 3.25rem);
		font-weight: 800;
		line-height: 1.15;
		letter-spacing: -0.02em;
	}
	h1 em {
		font-style: normal;
		background: linear-gradient(135deg, var(--icon-primary), var(--accent));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	.subtitle {
		margin-top: 1.25rem;
		color: var(--text-muted);
		max-width: 500px;
		line-height: 1.7;
	}
	.hero-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 2rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.6rem 1.3rem;
		border-radius: 8px;
		font-weight: 600;
		text-decoration: none;
		border: none;
		cursor: pointer;
	}
	.btn-primary {
		background: var(--accent);
		color: #fff;
	}
	.btn-primary:hover {
		filter: brightness(1.1);
	}
	.btn-ghost {
		background: transparent;
		color: var(--text);
		border: 1px solid var(--border);
	}
	.btn-ghost:hover {
		background: var(--surface);
	}

	/* Features */
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.25rem;
	}
	.feature-card-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.feature-icon {
		color: var(--icon-primary);
	}
	.feature-card-body p {
		color: var(--text-muted);
		font-size: 0.92rem;
	}

	/* Steps */
	.steps {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.steps li {
		display: flex;
		gap: 1rem;
	}
	.step-num {
		width: 2.25rem;
		height: 2.25rem;
		flex-shrink: 0;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--surface);
		color: var(--accent);
		font-weight: 700;
	}
	.steps h3 {
		font-weight: 600;
	}
	.steps p {
		color: var(--text-muted);
		font-size: 0.92rem;
	}

	/* CTA */
	.cta :global(svg) {
		color: var(--icon-primary);
	}
	.cta h2 {
		margin-bottom: 0;
	}
	.cta p {
		color: var(--text-muted);
	}
</style>
