<script lang="ts">
	// Decorative SVG waves + bubbles for the ocean theme
	// Non-interactive and marked as aria-hidden for accessibility
</script>

<div class="ocean-waves" aria-hidden="true">
	<svg class="waves" viewBox="0 0 1440 320" preserveAspectRatio="none" role="img">
		<defs>
			<linearGradient id="waveGradient" x1="0" x2="1">
				<stop offset="0%" stop-color="var(--ocean-gradient-start)" />
				<stop offset="100%" stop-color="var(--ocean-gradient-end)" />
			</linearGradient>
		</defs>
		<path
			class="wave wave1"
			fill="url(#waveGradient)"
			d="M0,64L48,90.7C96,117,192,171,288,170.7C384,171,480,117,576,90.7C672,64,768,64,864,85.3C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
		></path>
	</svg>

	<!-- Bubbles as purely decorative circles animated with CSS -->
	<div class="bubbles">
		<span class="bubble b1"></span>
		<span class="bubble b2"></span>
		<span class="bubble b3"></span>
	</div>
</div>

<style>
	.ocean-waves {
		position: fixed;
		inset: auto 0 0 0;
		height: 220px;
		pointer-events: none;
		z-index: 0;
	}

	.waves {
		width: 100%;
		height: 100%;
		display: block;
		transform-origin: center;
		animation: wave-shift 6s linear infinite;
	}

	.wave {
		opacity: 0.95;
	}

	.bubbles {
		position: absolute;
		right: 2rem;
		top: -2rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.bubble {
		display: block;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.75);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
		animation: bubble-rise 6s infinite ease-in;
		opacity: 0.9;
	}

	.b1 {
		animation-delay: 0s;
		transform: translateY(0) scale(1);
	}
	.b2 {
		animation-delay: 2s;
		transform: translateY(0) scale(0.9);
	}
	.b3 {
		animation-delay: 4s;
		transform: translateY(0) scale(0.8);
	}

	@media (prefers-reduced-motion: reduce) {
		.waves,
		.bubble {
			animation: none;
		}
	}
</style>
