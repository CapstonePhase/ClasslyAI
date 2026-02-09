<script lang="ts">
	let { path, size = 14 }: { path: string; size?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
>
	<path d={path} />
</svg>
