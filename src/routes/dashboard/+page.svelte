<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<div>
	<Card title={'To-Do'}>
		{#snippet content()}
			<ul>
				<li>Task 1</li>
				<li>Task 2</li>
				<li>Task 3</li>
			</ul>
		{/snippet}
	</Card>
	<Card title={'Popop'}>
		{#snippet content()}
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua.
		{/snippet}
	</Card>
</div>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap);
		padding: var(--gap);
	}
</style>
