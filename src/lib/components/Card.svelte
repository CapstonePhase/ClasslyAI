<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title,  card }: { title: string;  card: Snippet<[string]> } =
		$props();
</script>

{@render card(title)}
