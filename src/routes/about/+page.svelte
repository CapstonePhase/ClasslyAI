<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import PageHeader from '$lib/components/layout/PageHeader.svelte';
	import PageSection from '$lib/components/layout/PageSection.svelte';
	import PageFooter from '$lib/components/layout/PageFooter.svelte';
	import {
		faGraduationCap,
		faArrowRight,
		faBolt,
		faLock,
		faHeart
	} from '@fortawesome/free-solid-svg-icons';

	const values = [
		{
			icon: faBolt,
			title: 'Simple by design',
			text: 'No clutter, no learning curve — just paste a topic and go.'
		},
		{
			icon: faLock,
			title: 'Privacy first',
			text: 'Your data stays yours. We never sell or share what you study.'
		},
		{
			icon: faHeart,
			title: 'Built for students',
			text: 'Every feature exists because a student needed it.'
		}
	];
</script>

<PageHeader
	heading="Learning, reimagined."
	subtitle="ClasslyAI pairs the power of generative AI with proven study techniques so every student can learn faster, retain more, and stress less."
>
	{#snippet badge()}
		<Icon icon={faGraduationCap} size="1.2rem" />
		<span>About ClasslyAI</span>
	{/snippet}
</PageHeader>

<PageSection heading="Our mission" prose>
	<p>
		Education shouldn't depend on expensive tutors or one-size-fits-all textbooks. We're building an
		AI study companion that adapts to <em>you</em> — your pace, your topics, your goals.
	</p>
</PageSection>

<PageSection heading="What we stand for" grid>
	{#each values as value (value.title)}
		<Card preset="notched">
			{#snippet content()}
				<Icon icon={value.icon} size="2rem" color="var(--color-accent)" />
				<h3>{value.title}</h3>
				<p>{value.text}</p>
			{/snippet}
		</Card>
	{/each}
</PageSection>

<PageFooter
	heading="Ready to try it?"
	subtitle="Jump in and start your first AI-powered study session — it only takes a minute."
>
	<Button href="/dashboard" size="lg">
		Get Started
		<Icon icon={faArrowRight} />
	</Button>
</PageFooter>
