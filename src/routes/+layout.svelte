<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';

	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	import { resolve } from '$app/paths';
	import Fa from 'svelte-fa';
	import {
		faHome,
		faInfoCircle,
		faTachometerAlt,
		faQuestionCircle,
		faCog
	} from '@fortawesome/free-solid-svg-icons';

	const links: App.Link[] = [
		{ name: 'Home', path: '/', icon: faHome },
		{ name: 'Dashboard', path: '/dashboard', icon: faTachometerAlt },
		{ name: 'Quizzes', path: '/quizzes', icon: faQuestionCircle },
		{ name: 'About', path: '/about', icon: faInfoCircle }
	];

	let { children }: { children: Snippet } = $props();
</script>

<!------ HTML ------>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>classlyai</title>
</svelte:head>

<aside>
	<nav aria-label="Navigation">
		<ul>
			{#each links as link (link.path)}
				<li>
					<a href={resolve(link.path)} aria-label={link.name}>
						<Fa icon={link.icon} size="lg" />
						<span>{link.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<footer>
		<div class="settings" aria-label="Settings">
			<Fa icon={faCog} size="lg" />
			<span>Settings</span>
			<ThemeSwitcher />
		</div>
	</footer>
</aside>
<main>
	{@render children()}
</main>

<!------ /HTML ------>

<style>
	aside {
		position: fixed;
		top: 0;
		left: 0;
		width: var(--nav-width);
		height: 100vh;

		display: flex;
		flex-direction: column;

		background: var(--bg-navbar);
		backdrop-filter: blur(12px);
		border-right: 1px solid var(--border);

		z-index: 100;
		transition: width var(--transition-speed);
		overflow: hidden;
	}
	aside:hover {
		width: var(--nav-hover-width);
	}

	nav {
		flex: 1;
		overflow-y: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	nav::-webkit-scrollbar {
		display: none;
	}
	nav ul {
		list-style: none;
		padding: 0.5rem 0;
		margin: 0;

		display: flex;
		flex-direction: column;
	}
	nav a,
	footer .settings {
		height: 3.25rem;
		width: 100%;
		gap: 1rem;
		padding: 0 1.5rem;

		display: flex;
		align-items: center;

		color: var(--text-muted);
		text-decoration: none;
		background: transparent;
		border: none;
		cursor: pointer;
		font: inherit;
		font-size: 0.9rem;
		white-space: nowrap;
	}
	nav a:hover,
	footer .settings:hover {
		background: var(--nav-link-hover);
		color: var(--accent);
	}

	nav a :global(svg),
	footer .settings :global(svg) {
		width: 1.25rem;
		min-width: 1.25rem;
		color: var(--icon);
	}
	nav a:hover :global(svg),
	footer .settings:hover :global(svg) {
		color: var(--accent);
	}

	nav span,
	footer span {
		opacity: 0;
		transition: opacity var(--transition-speed);
	}
	aside:hover span {
		opacity: 1;
	}

	footer {
		padding: 0;
		border-top: 1px solid var(--border);
	}

	main {
		margin-left: var(--nav-width);
		min-height: 100vh;
		overflow-x: hidden;
	}

	@media (max-width: 600px) {
		aside {
			top: auto;
			bottom: 0;
			width: 100vw;
			height: auto;

			flex-direction: row;
			border-right: none;
			border-top: 1px solid var(--border);
		}
		aside:hover {
			width: 100vw;
		}
		nav ul {
			flex-direction: row;
			justify-content: space-around;
		}
		nav a {
			height: 3.5rem;
			padding: 0.25rem;
			gap: 0.2rem;

			flex-direction: column;
			justify-content: center;
			font-size: 0.7rem;
		}
		span {
			opacity: 1;
		}
		footer {
			display: none;
		}
		main {
			margin-left: 0;
			padding-bottom: 4.5rem;
		}
	}
</style>
