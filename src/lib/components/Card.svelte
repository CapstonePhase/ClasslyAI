<script lang="ts">
	let { title = 'Card Title', description = 'This is a description of the card content.' } =
		$props();
</script>

<div class="card">
	<article>
		<h2>{title}</h2>
		<p>{description}</p>
	</article>
</div>

<style>
	.card {
		/* Layered backgrounds: inner background on padding-box, gradient on border-box */
		background:
			linear-gradient(var(--card-bg, var(--bg-card)), var(--card-bg, var(--bg-card))) padding-box,
			var(--border-card) border-box;
		color: var(--card-foreground, var(--text));
		padding: 1rem;
		border: var(--card-border-width, 1px) solid transparent;
		border-radius: var(--radius);
		box-shadow: var(--card-shadow, var(--shadow));

		width: 100%;
		max-width: 420px;
		min-height: 180px;

		/* Oceany subtle glass + float */
		background-blend-mode: overlay;
		backdrop-filter: blur(4px);
		border: 1px solid rgba(255, 255, 255, 0.06);
		animation: float 6s ease-in-out infinite;

		/* Smooth, subtle scale on hover */
		transform-origin: center;
		transition:
			transform 180ms cubic-bezier(0.2, 0.9, 0.3, 1),
			box-shadow 180ms ease,
			background 180ms ease;
		will-change: transform;
	}

	.card::after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 40%;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent);
		border-top-left-radius: var(--radius);
		border-top-right-radius: var(--radius);
		pointer-events: none;
		opacity: 0.7;
	}

	@media (prefers-reduced-motion: reduce) {
		.card {
			animation: none;
		}
	}

	.card:hover {
		transform: scale(1.03);
		/* switch to the hover gradient variant */
		background:
			linear-gradient(var(--card-bg, var(--bg-card)), var(--card-bg, var(--bg-card))) padding-box,
			var(--border-card-hover) border-box;
		box-shadow: var(--card-shadow-hover, var(--shadow));
	}

	article {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
