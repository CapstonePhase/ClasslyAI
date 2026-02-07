<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import AnimatedWaves from '$lib/components/AnimatedWaves.svelte';
	let { children } = $props();
	let page = $state('home');
	let menuOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (menuOpen = false)} />

<div class="app-grid">
	<!-- Decorative ocean waves (purely visual) -->
	<AnimatedWaves />
	<div class="ocean-background" aria-hidden="true"></div>
	<!-- overlay for mobile menu -->
	<div
		class="overlay"
		onclick={() => (menuOpen = false)}
		class:visible={menuOpen}
		aria-hidden={!menuOpen}
	></div>

	<aside class:open={menuOpen} aria-hidden={!menuOpen}>
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<nav aria-label="Main">
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/dashboard">Dashboard</a></li>
				<li><a href="/library">Library</a></li>
				<li><a href="/assignments">Assignments</a></li>
				<li><a href="/quizzes">Quizzes</a></li>
			</ul>
		</nav>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
		<footer>
			<button>Settings</button>
		</footer>
	</aside>

	<section>
		<header>
			<button
				class="menu"
				aria-label="Toggle menu"
				onclick={() => (menuOpen = !menuOpen)}
				aria-expanded={menuOpen}>☰</button
			>
			<span class="header-title">{page}</span>

			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href="/profile" class="profile" aria-label="Profile"></a>
		</header>

		<main id="main" aria-hidden={menuOpen}>{@render children()}</main>
	</section>
</div>

<style>
	:global(.app-container) {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		color: var(--text);
	}

	.app-grid {
		display: grid;
		grid-template-columns: var(--aside-width) 1fr;
		gap: var(--gap);
		align-items: start;
		min-height: 100vh;
	}

	/* Overlay for mobile menu */
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		opacity: 0;
		pointer-events: none;
		transition: opacity 180ms ease;
		z-index: 10;
	}
	.overlay.visible {
		opacity: 1;
		pointer-events: auto;
	}

	aside {
		background: var(--bg-aside);
		padding: 1rem;
		border-right: 1px solid var(--border);
		box-sizing: border-box;
		/* allow normal flow on desktop */
		/* height: 100vh; */
		position: sticky;
		top: 0;
		align-self: start;
		z-index: 20;
	}

	aside nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	aside ul li {
		margin-bottom: 10px;
		font-size: 16px;
	}

	aside ul li a {
		text-decoration: none;
		color: inherit;
		display: block;
		padding: 10px;
		border-radius: var(--radius);
	}

	aside ul li a:hover,
	aside ul li a:focus {
		background: var(--bg-active);
		color: var(--text);
	}

	section {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background: var(--bg-header);
		border-bottom: 1px solid var(--border);
		box-sizing: border-box;
		position: sticky;
		top: 0;
		z-index: 15;
	}

	header .profile {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: var(--bg-profile);
	}

	header span {
		font-size: 1.25rem;
		font-weight: 500;
	}

	header button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}
	/* Main content */
	main {
		flex: 1;
		padding: 1.5rem;
		overflow: auto;
	}

	/* Accessibility: skip link (visually hidden until focused) */
	:global(.skip-link) {
		position: absolute;
		left: -9999px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	:global(.skip-link:focus) {
		left: 1rem;
		top: 1rem;
		width: auto;
		height: auto;
		padding: 0.5rem 1rem;
		background: var(--bg-header);
		color: var(--text);
		z-index: 30;
		border-radius: 4px;
	}

	/* Mobile adjustments */
	@media (max-width: var(--mobile-breakpoint)) {
		.app-grid {
			grid-template-columns: 1fr;
		}
		aside {
			position: fixed;
			left: -100%;
			top: 0;
			height: 100%;
			width: var(--aside-width);
			transition: left 200ms ease;
			box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
		}
		aside.open {
			left: 0;
		}
		section {
			min-height: calc(100vh - var(--header-height));
		}
	}
</style>
