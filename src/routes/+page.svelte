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
	import { resolve } from '$app/paths';

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

<!------ HTML ------>

<header class="section section-center hero">
	<div class="hero-badge">
		<Fa icon={faRobot} />
		<span>Powered by Gemini</span>
	</div>
	<h1>Study smarter,<br /><em>not harder.</em></h1>
	<p class="subtitle">
		ClasslyAI generates personalized study material, quizzes, and performance analytics — all driven
		by AI so you can focus on actually learning.
	</p>
	<nav>
		<a href={resolve('/dashboard')} class="btn btn-primary">
			Get Started
			<Fa icon={faArrowRight} />
		</a>
		<a href={resolve('/about')} class="btn btn-ghost">Learn More</a>
	</nav>
</header>

<section class="section">
	<h2 class="section-title">Everything you need to ace it</h2>
	<div class="auto-grid">
		<Card title="AI Study Material">
			{#snippet content()}
				<span class="icon-accent"><Fa icon={faBookOpen} size="lg" /></span>
				<p class="text-muted feature-text">
					Enter any topic and get curated notes, summaries, and key concepts generated instantly by
					Gemini.
				</p>
			{/snippet}
		</Card>

		<Card title="Smart Quizzes">
			{#snippet content()}
				<span class="icon-accent"><Fa icon={faClipboardQuestion} size="lg" /></span>
				<p class="text-muted feature-text">
					Auto-generated quizzes tailored to your study material. Multiple choice, short answer —
					you name it.
				</p>
			{/snippet}
		</Card>

		<Card title="Performance Analytics">
			{#snippet content()}
				<span class="icon-accent"><Fa icon={faChartLine} size="lg" /></span>
				<p class="text-muted feature-text">
					Track your scores, spot weak areas, and watch your progress over time with clear visual
					breakdowns.
				</p>
			{/snippet}
		</Card>
	</div>
</section>

<section class="section">
	<h2 class="section-title">How it works</h2>
	<ol>
		{#each steps as step, index (step.title)}
			<li>
				<span>{index + 1}</span>
				<div>
					<h3>{step.title}</h3>
					<p class="text-muted">{step.description}</p>
				</div>
			</li>
		{/each}
	</ol>
</section>

<footer class="section section-center cta">
	<Fa icon={faGraduationCap} size="2x" />
	<h2 class="section-title">Ready to level up?</h2>
	<p class="text-muted">Jump into your dashboard and start your first AI study session.</p>
	<a href={resolve('/dashboard')} class="btn btn-primary">
		Open Dashboard
		<Fa icon={faArrowRight} />
	</a>
</footer>

<!------ /HTML ------>

<style>
	.cta {
		padding-top: 3rem;
		padding-bottom: 4rem;
		gap: 0.75rem;
	}

	/* Hero nav */
	header nav {
		display: flex;
		gap: 0.75rem;
		margin-top: 2rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	/* Feature text spacing */
	.feature-text {
		margin-top: 0.5rem;
		font-size: 0.92rem;
	}

	/* Steps */
	ol {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	ol li {
		display: flex;
		gap: 1rem;
	}

	ol span {
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

	ol h3 {
		font-weight: 600;
	}

	/* CTA icon */
	footer :global(svg) {
		color: var(--icon-primary);
	}

	.cta :global(.section-title) {
		margin-bottom: 0;
	}
</style>
