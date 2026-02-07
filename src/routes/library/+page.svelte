<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<header>
	<h1>Library</h1>
	<p>Access course readings, reference materials, and recordings.</p>
</header>

<section class="grid">
	<Card title="Textbooks" description="Digital copies of required course books." />
	<Card title="Lecture Recordings" description="Archive of past zoom sessions." />
	<Card title="Supplementary" description="Extra reading materials and links." />
	<Card title="Shared Files" description="Class collaboration folder." />
</section>

<style>
	header {
		margin-bottom: 2rem;
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--gap);
	}
</style>
