<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<header>
	<h1>Dashboard</h1>
	<p>Overview of your current performance and metrics.</p>
</header>

<section class="grid">
	<Card title="Analytics" description="Real-time traffic data and user engagement stats." />
	<Card title="Recent Activity" description="Latest updates from your team and projects." />
	<Card title="Notifications" description="3 unread alerts require your attention." />
	<Card title="System Status" description="All systems operational. Uptime: 99.9%." />
</section>

<style>
	header {
		margin-bottom: 2rem;
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 600;
	}

	p {
		margin: 0;
		color: var(--text);
		opacity: 0.8;
	}

	.grid {
		display: grid;
		/* Create a responsive grid that fits the 350px cards */
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: var(--gap);
		align-items: start;
		justify-items: center; /* Centers cards if the column is wider than the card */
	}
</style>
