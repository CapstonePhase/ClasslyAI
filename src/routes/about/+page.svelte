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

<svelte:head>
	<title>About — ClasslyAI</title>
</svelte:head>

<!-- Hero -->
<section class="hero">
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
<section class="mission">
	<h2>Our mission</h2>
	<p>
		Education shouldn't depend on expensive tutors or one-size-fits-all textbooks. We're building an
		AI study companion that adapts to <em>you</em> — your pace, your topics, your goals — and makes high-quality
		learning accessible to everyone.
	</p>
</section>

<!-- Values -->
<section class="values">
	<h2>What we stand for</h2>
	<div class="values-grid">
		{#each values as v}
			<Card title={v.title}>
				{#snippet content()}
					<div class="value-body">
						<span class="value-icon"><Fa icon={v.icon} size="lg" /></span>
						<p>{v.text}</p>
					</div>
				{/snippet}
			</Card>
		{/each}
	</div>
</section>

<!-- CTA -->
<section class="cta">
	<h2>Ready to try it?</h2>
	<p>Jump in and start your first AI-powered study session — it only takes a minute.</p>
	<a href="/dashboard" class="btn btn-primary">
		Get Started
		<Fa icon={faArrowRight} />
	</a>
</section>

<style>
	/* Shared section centering (mirrors home page) */
	.hero,
	.mission,
	.values,
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

	/* Mission */
	.mission p {
		color: var(--text-muted);
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
	.values-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.25rem;
	}
	.value-body {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.value-icon {
		color: var(--icon-primary);
	}
	.value-body p {
		color: var(--text-muted);
		font-size: 0.92rem;
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

	/* CTA */
	.cta p {
		color: var(--text-muted);
	}
</style>
