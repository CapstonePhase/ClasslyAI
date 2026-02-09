<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import AreaChart from '$lib/components/AreaChart.svelte';
	import Table from '$lib/components/Table.svelte';
	import StudentTableFilters from '$lib/components/StudentTableFilters.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	import biki from '$lib/assets/biki.jpg';
	import owo from '$lib/assets/owo.jpg';
	import red from '$lib/assets/red.jpg';
	import tank from '$lib/assets/tank.jpg';
	import water from '$lib/assets/water.jpg';
	import jif from '$lib/assets/bwolfie.gif';

	// ── Icon paths ──
	const PLUS = 'M12 5v14M5 12h14';
	const CLOSE = 'M18 6L6 18M6 6l12 12';

	// ── Table config ──
	const columns = [
		{ key: 'name', label: 'Student Name' },
		{ key: 'course', label: 'Course' },
		{ key: 'grade', label: 'Grade', align: 'center' as const },
		{ key: 'attendance', label: 'Attendance', sortable: true, align: 'center' as const },
		{ key: 'status', label: 'Status' }
	];

	const tableData = [
		{
			name: 'Alice Johnson',
			course: 'Mathematics',
			grade: 'A',
			attendance: '95%',
			status: 'Active'
		},
		{ name: 'Bob Smith', course: 'Physics', grade: 'B+', attendance: '88%', status: 'Active' },
		{
			name: 'Charlie Brown',
			course: 'Chemistry',
			grade: 'A-',
			attendance: '92%',
			status: 'Active'
		},
		{ name: 'Diana Prince', course: 'Biology', grade: 'A+', attendance: '98%', status: 'Active' },
		{
			name: 'Ethan Hunt',
			course: 'Computer Science',
			grade: 'B',
			attendance: '85%',
			status: 'Active'
		},
		{ name: 'Fiona Green', course: 'English', grade: 'A', attendance: '90%', status: 'Active' },
		{
			name: 'George Wilson',
			course: 'History',
			grade: 'B-',
			attendance: '80%',
			status: 'Inactive'
		},
		{ name: 'Hannah Lee', course: 'Art', grade: 'A+', attendance: '97%', status: 'Active' },
		{ name: 'Ivan Petrov', course: 'Music', grade: 'B+', attendance: '86%', status: 'Active' },
		{ name: 'Julia Kim', course: 'Economics', grade: 'A-', attendance: '91%', status: 'Active' },
		{
			name: 'Kevin Hart',
			course: 'Philosophy',
			grade: 'C+',
			attendance: '72%',
			status: 'Inactive'
		},
		{ name: 'Luna Martinez', course: 'Sociology', grade: 'A', attendance: '94%', status: 'Active' }
	];

	const chartLabels = ['Jun 24', 'Jun 25', 'Jun 26', 'Jun 27', 'Jun 28', 'Jun 29', 'Jun 30'];

	const chartDatasets = [
		{ label: 'Desktop', values: [186, 105, 237, 209, 114, 150, 204] },
		{ label: 'Mobile', values: [80, 90, 200, 140, 85, 120, 160] }
	];

	const timeRanges = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 12 months'];
	let selectedRange = $state('Last 7 days');

	// --- To-Do state ---
	interface Todo {
		id: number;
		text: string;
		done: boolean;
	}

	let nextId = $state(7);
	let newTodo = $state('');
	let todos = $state<Todo[]>([
		{ id: 1, text: 'get shit done', done: false },
		{ id: 2, text: 'east sleep chode repeat', done: false },
		{ id: 3, text: 'vishnu ko call', done: true },
		{ id: 4, text: 'git commit', done: false },
		{ id: 5, text: 'ek dsa kuch khub bhi paincho', done: false },
		{ id: 6, text: 'ok ho gaya', done: true }
	]);

	const remaining = $derived(todos.filter((t) => !t.done).length);

	function addTodo() {
		const text = newTodo.trim();
		if (!text) return;
		todos = [{ id: nextId++, text, done: false }, ...todos];
		newTodo = '';
	}

	function removeTodo(id: number) {
		todos = todos.filter((t) => t.id !== id);
	}
	function clearCompleted() {
		todos = todos.filter((t) => !t.done);
	}

	// ── Toolbar / filters ──
	let statusFilter = $state('all');
	let courseFilter = $state('all');
	let searchQuery = $state('');

	const courses = $derived([...new Set(tableData.map((d) => String(d.course)))].sort());

	const filteredData = $derived.by(() => {
		let result = tableData;
		if (statusFilter !== 'all')
			result = result.filter((r) => r.status.toLowerCase() === statusFilter);
		if (courseFilter !== 'all') result = result.filter((r) => r.course === courseFilter);
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(r) =>
					r.name.toLowerCase().includes(q) ||
					r.course.toLowerCase().includes(q) ||
					r.grade.toLowerCase().includes(q)
			);
		}
		return result;
	});

	let hiddenColumns = new SvelteSet<string>();
	let columnsOpen = $state(false);
	const visibleColumns = $derived(columns.filter((c) => !hiddenColumns.has(c.key)));

	function toggleColumn(key: string) {
		if (hiddenColumns.has(key)) hiddenColumns.delete(key);
		else if (hiddenColumns.size < columns.length - 1) hiddenColumns.add(key);
	}

	function handleClickOutside(e: MouseEvent) {
		if (!(e.target as HTMLElement).closest('details')) columnsOpen = false;
	}
</script>

<!------ HTML ------>

<svelte:window onclick={handleClickOutside} />

<!-- Dashboard header -->
<header class="section section-center hero dash-hero">
	<h1>Your <em>Dashboard</em></h1>
	<p class="subtitle">Overview of your classes, media, and tasks — all in one place.</p>
</header>

<div class="media-row">
	<div class="media-grid">
		{#each [biki, owo, red, tank, water, jif] as src, i (i)}
			<div class="media-card"><img {src} alt="media-{i}" /></div>
		{/each}
		<div class="media-card">
			<iframe
				title="YouTube video player"
				src="https://www.youtube-nocookie.com/embed/w5VFOKKAbQQ?list=RDw5VFOKKAbQQ"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>
	</div>
	<div class="data-card todo-card">
		<div class="todo-header">
			<strong>To-Do</strong>
			<span class="text-muted todo-count">{remaining} remaining</span>
		</div>
		<form
			class="todo-input"
			onsubmit={(e) => {
				e.preventDefault();
				addTodo();
			}}
		>
			<input class="input" type="text" placeholder="Add a task…" bind:value={newTodo} />
			<button type="submit" class="icon-btn" aria-label="Add task" disabled={!newTodo.trim()}>
				<Icon path={PLUS} size={16} />
			</button>
		</form>
		<ul class="todo-list">
			{#each todos as todo (todo.id)}
				<li class:done={todo.done}>
					<label class="todo-item">
						<input type="checkbox" bind:checked={todo.done} />
						<span>{todo.text}</span>
					</label>
					<button class="todo-remove" aria-label="Remove" onclick={() => removeTodo(todo.id)}>
						<Icon path={CLOSE} />
					</button>
				</li>
			{/each}
		</ul>
		{#if todos.some((t) => t.done)}
			<div class="todo-footer">
				<button class="btn btn-ghost" onclick={clearCompleted}>Clear completed</button>
			</div>
		{/if}
	</div>
</div>

<AreaChart labels={chartLabels} datasets={chartDatasets} {timeRanges} bind:selectedRange />

<StudentTableFilters
	bind:statusFilter
	bind:courseFilter
	bind:searchQuery
	{courses}
	{columns}
	{hiddenColumns}
	bind:columnsOpen
	{toggleColumn}
/>

<Table columns={visibleColumns} data={filteredData} selectable paginated pageSize={5}>
	{#snippet cell({ column, value })}
		{#if column.key === 'status'}
			<span class="badge" class:success={value === 'Active'} class:muted={value !== 'Active'}>
				<span class="badge-dot"></span>
				{value}
			</span>
		{:else}
			{value ?? ''}
		{/if}
	{/snippet}
</Table>

<!------ /HTML ------>

<style>
	/* Dashboard hero — compact */
	.dash-hero {
		padding-top: 2rem;
		padding-bottom: 1.5rem;
	}

	/* Layout: media row */
	.media-row {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: var(--gap);
		/* Remove fixed aspect-ratio to allow cards to determine height */
	}

	@media (max-width: 900px) {
		.media-row {
			grid-template-columns: 1fr;
		}
	}

	/* Scroll strip overrides */
	.media-grid {
		display: flex;
		gap: 0.5rem;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x proximity;
		scroll-behavior: smooth;
		overscroll-behavior-x: contain;
		padding: 0.5rem;
		min-height: 200px;
	}

	/* Hide scrollbar for Chrome, Safari and Opera */
	.media-grid::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.media-grid {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	/* Media cards — sizing only */
	.media-card {
		flex: 0 0 280px;
		height: 210px;
		border-radius: var(--radius);
		scroll-snap-align: start;
		scroll-snap-stop: normal;
		overflow: hidden;
		background: var(--surface);
	}

	.media-card img,
	.media-card iframe {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border: none;
	}

	/* Todo card specific tweaks */
	.todo-card {
		display: flex;
		flex-direction: column;
		max-height: 400px;
	}

	.todo-list {
		flex: 1;
		overflow-y: auto;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (max-width: 640px) {
		.media-card {
			flex: 0 0 240px;
			height: 180px;
		}

		.todo-card {
			max-height: none;
		}
	}
</style>
