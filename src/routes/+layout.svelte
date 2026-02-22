<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import {
		faHome,
		faTachometerAlt,
		faQuestionCircle,
		faInfoCircle,
		faCog,
		faCloudMoonRain
	} from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/state';

	import { resolve } from '$app/paths';
	let { children }: { children: Snippet } = $props();

	// 2. APPLY the global App.Link type here
	const links: App.Link[] = [
		{ name: 'Home', path: '/', icon: faHome, size: '2x' },
		{ name: 'Dashboard', path: '/dashboard', icon: faTachometerAlt, size: '2x' },
		{ name: 'Quizzes', path: '/quizzes', icon: faQuestionCircle, size: '2x' },
		{ name: 'About', path: '/about', icon: faInfoCircle, size: '2x' }
	];
</script>

<aside class="sidebar" role="navigation">
	<header>
		<ul>
			<li>
				<div class="logo">
					<Icon icon={faCog} size="2x" />
					<span>ClasslyAI</span>
				</div>
			</li>
		</ul>
	</header>
	<nav>
		<ul>
			{#each links as link (link.path)}
				<li>
					<a href={resolve(link.path)} class:active={page.url.pathname === resolve(link.path)}>
						<Icon icon={link.icon} size={link.size} />
						<span>{link.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<footer>
		<ul>
			<li>
				<div class="settings" aria-label="Settings">
					<Icon icon={faCloudMoonRain} size="2x" />
					<span>Settings </span>
				</div>
			</li>
		</ul>
	</footer>
</aside>

<main>
	{@render children()}
</main>

<style>
	* {
		--sidebar: 4rem;
	}

	main {
		margin-left: var(--sidebar);
	}
	.sidebar {
		position: fixed;
		background-color: var(--bg);
		transition: width var(--speed) ease;
		overflow: none;
		z-index: 10;
		position: fixed;
		display: grid;
		grid-template-rows: auto 1fr auto;
		border-right: 1px solid var(--text-muted);
	}
	.sidebar ul,
	li,
	a,
	div {
		height: 4rem;
		text-decoration: none;
	}
	.sidebar a,
	div {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 1rem;
	}

	.sidebar a:hover,
	div:hover {
		color: var(--text-muted);
	}
	.sidebar a.active {
		color: var(--text-muted);
	}
	.sidebar a,
	div {
		color: var(--text);
	}

	.settings {
		font-weight: bold;
	}
	.logo {
		font-weight: bold;
		text-transform: uppercase;
	}
	.logo:hover :global(.icon) {
		transform: rotate(0deg);
		transition: transform var(--speed);
	}

	.sidebar:hover .logo :global(.icon) {
		transform: rotate(-120deg);
		transition: transform var(--speed);
	}

	@media only screen and (max-width: 600px) {
		.sidebar {
			bottom: 0;
			width: 100vw;
			height: var(--sidebar);
			overflow: hidden;
		}
		header,
		span,
		:global(.theme-toggle) {
			display: none;
		}

		.sidebar ul {
			display: flex;
			justify-content: space-around;
		}
		main {
			margin: 0;
		}
	}

	@media only screen and (min-width: 600px) {
		.sidebar {
			top: 0;
			width: var(--sidebar);
			height: 100vh;
		}
		.sidebar:hover {
			width: 16rem;
		}

		.sidebar span {
			display: none;
			margin: 0 2rem;
		}
		.sidebar:hover span {
			display: flex;
			flex-direction: row;
		}
	}
</style>
