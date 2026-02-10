<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Fa from 'svelte-fa';
	import {
		faGraduationCap,
		faBolt,
		faLock,
		faHeart,
		faArrowRight
	} from '@fortawesome/free-solid-svg-icons';
	import { resolve } from '$app/paths';

	const values = [
		{
			icon: faBolt,
			title: 'Simple by design',
			text: 'No clutter, no learning curve — just paste a topic and go.'
		},
		{
			icon: faLock,
			title: 'Privacy first',
			text: 'Your data stays yours. We never sell or share what you study.'
		},
		{
			icon: faHeart,
			title: 'Built for students',
			text: 'Every feature exists because a student needed it.'
		}
	];
</script>

<!-- Hero -->
<section class="section section-center hero">
	<div class="hero-badge">
		<Fa icon={faGraduationCap} />
		<span>About ClasslyAI</span>
	</div>
	<h1>Learning, <em>reimagined.</em></h1>
	<p class="subtitle">
		ClasslyAI pairs the power of generative AI with proven study techniques so every student can
		learn faster, retain more, and stress less.
	</p>
</section>

<!-- Mission -->
<section class="section mission">
	<h2 class="section-title">Our mission</h2>
	<p class="text-muted mission-body">
		Education shouldn't depend on expensive tutors or one-size-fits-all textbooks. We're building an
		AI study companion that adapts to <em>you</em> — your pace, your topics, your goals — and makes high-quality
		learning accessible to everyone.
	</p>
</section>

<!-- Values -->
<section class="section">
	<h2 class="section-title">What we stand for</h2>
	<div class="auto-grid">
		{#each values as v (v.title)}
			<Card title={v.title}>
				{#snippet content()}
					<div class="value-body">
						<span class="icon-accent"><Fa icon={v.icon} size="lg" /></span>
						<p class="text-muted value-text">{v.text}</p>
					</div>
				{/snippet}
			</Card>
		{/each}
	</div>
</section>

<!-- CTA -->
<section class="section section-center cta">
	<h2 class="section-title">Ready to try it?</h2>
	<p class="text-muted">
		Jump in and start your first AI-powered study session — it only takes a minute.
	</p>
	<a href={resolve('/dashboard')} class="btn btn-primary">
		Get Started
		<Fa icon={faArrowRight} />
	</a>
</section>

<style>
	.cta {
		padding-top: 3rem;
		padding-bottom: 4rem;
		gap: 0.75rem;
	}

	/* Mission */
	.mission-body {
		line-height: 1.8;
		text-align: center;
		max-width: 560px;
		margin: 0 auto;
	}

	.mission em {
		font-style: normal;
		color: var(--text);
		font-weight: 600;
	}

	/* Values */
	.value-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.value-text {
		font-size: 0.92rem;
	}
</style>
