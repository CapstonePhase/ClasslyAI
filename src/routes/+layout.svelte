<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<div>
		<a href="/">Home</a>
		<a href="/about">About</a>
	</div>

	<a href="/profile" class="profile" aria-label="Profile"></a>
</nav>

{@render children()}

<style>
	nav {
		display: flex;
		justify-content: space-between; /* Pushes links to left, profile to right */
		align-items: center; 
	}

	div {
		display: flex;
		gap: 1rem; /* Space between links */
	}

	/* Rectangle styling for links */
	div a {
		text-decoration: none;
		color: var(--text);
		padding: 0.5rem 1rem;
		display: inline-block;
	}

	div a:hover {
		background-color: var(--bg-active);
	}

	/* Circle styling for profile button */
	.profile {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: #555;
		display: inline-block;
	}
	
	.profile:hover {
		background-color: #333;
	}
</style>