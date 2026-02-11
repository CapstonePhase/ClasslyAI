<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Icon from '$lib/components/Icon.svelte';
	import AreaChart from '$lib/components/AreaChart.svelte';
	import Table from '$lib/components/Table.svelte';
	import StudentTableFilters from '$lib/components/StudentTableFilters.svelte';

	import Fa from 'svelte-fa';
	import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
	import Gallery from '$lib/components/Gallery.svelte';

	// Media assets are imported automatically from the `src/lib/assets` folder using a Vite glob
	// Supported types: jpg, jpeg, png, gif, webp See `mediaAssets` initialization below.

	// __ Galley Imports __

	const modules = import.meta.glob('$lib/assets/*.{jpg,jpeg,png,webp,gif}', {
		as: 'url',
		eager: true
	});
	const media = Object.entries(modules)
		.sort(([left], [right]) => left.localeCompare(right))
		.map(([, url]) => url);

	let tall = new SvelteSet(); // indexes for tall items (0-based)
	let long = new SvelteSet();

	onMount(async () => {
		const portrait = new SvelteSet();
		const landscape = new SvelteSet();
		await Promise.all(
			media.map(async (src, index) => {
				const img = new Image();
				img.src = src;
				await img.decode().catch(() => {});
				if (img.naturalHeight > img.naturalWidth * 1.2) portrait.add(index);
				else if (img.naturalWidth > img.naturalHeight * 1.2) landscape.add(index);
			})
		);
		tall.clear();
		for (const index of portrait) tall.add(index);
		long.clear();
		for (const index of landscape) long.add(index);
	});

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
	<div class="hero-badge">
		<Fa icon={faTachometerAlt} />
		<span>Study Dashboard</span>
	</div>
	<h1>Your <em>Dashboard</em></h1>
	<p class="subtitle">Overview of your classes, media, and tasks — all in one place.</p>
</header>

<div class="section-wide dashboard-content">
	<div class="media-row">
		<Gallery />
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

	<div class="table-section">
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
	</div>
</div>

<!------ /HTML ------>

<style>
	.dashboard-content {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
		padding-bottom: 4rem;
	}

	.table-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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

	/* ===== Todo card ===== */
	.todo-card {
		display: flex;
		flex-direction: column;
		height: 440px;
		overflow: hidden;
	}

	.todo-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
		font-size: 0.875rem;
	}

	.todo-count {
		font-size: 0.75rem;
	}

	.todo-input {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--border);
	}

	.todo-input .input {
		flex: 1;
		padding: 0.4rem 0.65rem;
		font-size: 0.8rem;
	}

	.todo-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow-y: auto;
	}

	.todo-list li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--border);
		color: var(--text);
		font-size: 0.85rem;
		transition: background-color var(--transition-speed);
	}

	.todo-list li:last-child {
		border-bottom: none;
	}

	.todo-list li:hover {
		background: var(--surface);
	}

	.todo-list li.done {
		opacity: 0.55;
	}

	.todo-item {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		cursor: pointer;
		flex: 1;
		min-width: 0;
	}

	.todo-item input[type='checkbox'] {
		width: 16px;
		height: 16px;
		border-radius: 4px;
		accent-color: var(--accent);
		cursor: pointer;
		flex-shrink: 0;
	}

	.todo-item span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.todo-list li.done .todo-item span {
		text-decoration: line-through;
		color: var(--text-muted);
	}

	.todo-remove {
		display: flex;
		align-items: center;
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		padding: 0.15rem;
		border-radius: 4px;
		opacity: 0;
		transition:
			opacity var(--transition-speed),
			color var(--transition-speed);
	}

	.todo-list li:hover .todo-remove {
		opacity: 1;
	}

	.todo-remove:hover {
		color: var(--danger);
	}

	.todo-footer {
		display: flex;
		justify-content: flex-end;
		padding: 0.5rem 0.75rem;
		border-top: 1px solid var(--border);
	}
</style>
