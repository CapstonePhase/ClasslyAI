<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<section>
	<Card title="TO-DO" description="check out hwat you have left to do" />
	<Card title="Announcements" description="Latest class news and updates" />
	<Card title="Schedule" description="Your weekly timetable and office hours" />
</section>

<style>
	section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		padding: 1rem;
	}
</style>
