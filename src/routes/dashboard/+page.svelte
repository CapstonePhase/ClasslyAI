<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	type Item = { id: number; title: string; data?: string };

	let items: Item[] = [
		{ id: 1, title: 'Do Dishes', data: 'idk important' },
		{ id: 1, title: 'Make Love not war' }
	];
</script>

<div>
	<Card title={'To-Do'}>
		{#snippet card(header)}
			<div class="card">
				<h3>{header}</h3>
				<ul id="content">
					<li>Task 1</li>
					<li>Task 2</li>
					<li>Task 3</li>
				</ul>
			</div>
		{/snippet}
	</Card>
	<Card title={'Popop'}>
		{#snippet card(header)}
			<div class="card">
				<h3>{header}</h3>
				<p id="content">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua.
				</p>
			</div>
		{/snippet}
	</Card>
</div>

<style>
	/* parent */
	div {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		padding: 1rem;
		background-color: lightblue;
		border: var(--card-border, 1px solid var(--border));
		border-radius: 1rem;
		box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2);
		box-sizing: 100%;
	}
	/* child */
	.card {
		background-color: aliceblue;
		display: flex;
		flex-direction: column;
		flex: 1;
		width: 200px;
	}
	#content {
		background-color: var(--card-bg, var(--bg));
		border: var(--card-border, 1px solid var(--border));
	}
</style>
