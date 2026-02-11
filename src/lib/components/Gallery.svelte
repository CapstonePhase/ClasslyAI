<script>
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Card from './Card.svelte';

	// auto-import all images from the assets folder as URLs (eager, so available on mount)
	const modules = import.meta.glob('$lib/assets/*.{jpg,jpeg,png,webp,gif}', {
		as: 'url',
		eager: true
	});
	const media = Object.entries(modules)
		.sort(([left], [right]) => left.localeCompare(right))
		.map(([, url]) => url);

	let tall = new SvelteSet(); // indexes for tall items (0-based)
	let long = new SvelteSet();

	onMount(async () => {
		const portrait = new SvelteSet();
		const landscape = new SvelteSet();
		await Promise.all(
			media.map(async (src, index) => {
				const img = new Image();
				img.src = src;
				await img.decode().catch(() => {});
				if (img.naturalHeight > img.naturalWidth * 1.2) portrait.add(index);
				else if (img.naturalWidth > img.naturalHeight * 1.2) landscape.add(index);
			})
		);
		tall.clear();
		for (const index of portrait) tall.add(index);
		long.clear();
		for (const index of landscape) long.add(index);
	});
</script>

<div class="gallery">
	{#each media as src, index (src)}
		<img {src} alt={`img${index}`} class:tall={tall.has(index)} class:long={long.has(index)} />
	{/each}
</div>

<style>
	* {
		--width: 180px;
	}
	.gallery {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--width), 1fr));
		grid-auto-rows: var(--width);
		grid-auto-flow: row dense;
		gap: 1rem;
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--radius-base);
		transition:
			transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
			filter 0.6s ease,
			opacity 0.4s ease;
		will-change: transform;

		animation: imageFade 0.8s ease forwards;
		opacity: 0;
	}

	img:hover {
		cursor: pointer;
		transform: scale(1.05);
	}

	/* Subtle fade-in animation (opacity-only to avoid clashing with hover transforms) */
	img {
	}

	@keyframes imageFade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes galleryFade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media screen and (min-width: 600px) {
		.tall {
			grid-row: span 2;
		}

		.long {
			grid-column: span 2;
		}
	}
</style>
