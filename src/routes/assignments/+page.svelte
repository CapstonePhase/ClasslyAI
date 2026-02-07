<script lang="ts">
	import Card from '$lib/components/Card.svelte';

	// (no client-side loader yet)
</script>

<header>
	<h1>Assignments</h1>
	<p>Manage your upcoming tasks and deadlines.</p>
</header>

<section class="grid">
	<Card title="Math 101" description="Due: Oct 15 - Calculus Problem Set 4" />
	<Card title="History Essay" description="Due: Oct 18 - World War II Research" />
	<Card title="Physics Lab" description="Due: Oct 20 - Motion Experiments" />
</section>

<style>
	header {
		margin-bottom: 2rem;
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
	}

	p {
		color: var(--text);
		opacity: 0.8;
		margin: 0;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--gap);
	}
</style>
