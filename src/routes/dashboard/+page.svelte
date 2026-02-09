<script lang="ts">
	import AreaChart from '$lib/components/AreaChart.svelte';
	import biki from '$lib/assets/biki.jpg';
	import owo from '$lib/assets/owo.jpg';
	import red from '$lib/assets/red.jpg';
	import tank from '$lib/assets/tank.jpg';
	import water from '$lib/assets/water.jpg';
	import jif from '$lib/assets/bwolfie.gif';
	import Table from '$lib/components/Table.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	// Sample data for the table
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

	// --- Toolbar state ---
	let statusFilter = $state('all');
	let courseFilter = $state('all');
	let searchQuery = $state('');

	const courses = $derived([...new Set(tableData.map((d) => String(d.course)))].sort());

	const filteredData = $derived.by(() => {
		let result = tableData;

		if (statusFilter !== 'all') {
			result = result.filter((r) => r.status.toLowerCase() === statusFilter);
		}
		if (courseFilter !== 'all') {
			result = result.filter((r) => r.course === courseFilter);
		}
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

	// Column visibility
	let hiddenColumns = new SvelteSet<string>();
	let columnsOpen = $state(false);

	const visibleColumns = $derived(columns.filter((c) => !hiddenColumns.has(c.key)));

	function toggleColumn(key: string) {
		if (hiddenColumns.has(key)) {
			hiddenColumns.delete(key);
		} else if (hiddenColumns.size < columns.length - 1) {
			hiddenColumns.add(key);
		}
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('details')) {
			columnsOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<!------ HTML ------>

<div>header for dashboard</div>

<div id="container">
	<div id="child"><img src={biki} alt="biki" /></div>
	<div id="child"><img src={owo} alt="owo" /></div>
	<div id="child"><img src={red} alt="red" /></div>
	<div id="child"><img src={tank} alt="tank" /></div>
	<div id="child"><img src={water} alt="water" /></div>
	<div id="child"><img src={jif} alt="jif" /></div>
	<div id="child">
		<iframe
			title="awsome songs from yt"
			src="https://www.youtube.com/embed/w5VFOKKAbQQ?list=RDw5VFOKKAbQQ"
			allow="autoplay; encrypted-media"
			allowfullscreen
		>
		</iframe>
	</div>
</div>

<AreaChart labels={chartLabels} datasets={chartDatasets} {timeRanges} bind:selectedRange />

<form aria-labelledby="filters-legend">
	<fieldset>
		<label>
			<select class="select" bind:value={statusFilter}>
				<option value="all">All Status</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>

			<select class="select" bind:value={courseFilter}>
				<option value="all">All Courses</option>
				{#each courses as course (course)}
					<option value={course}>{course}</option>
				{/each}
			</select>
		</label>

		<search>
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
			</svg>
			<input type="search" placeholder="Search students..." bind:value={searchQuery} />
		</search>

		<menu>
			<details>
				<summary
					class="btn btn-ghost"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						columnsOpen = !columnsOpen;
					}}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect x="3" y="3" width="7" height="18" rx="1" />
						<rect x="14" y="3" width="7" height="18" rx="1" />
					</svg>
					Columns
					<svg
						width="10"
						height="10"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M6 9l6 6 6-6" />
					</svg>
				</summary>

				{#if columnsOpen}
					<div>
						{#each columns as col (col.key)}
							<label>
								<input
									type="checkbox"
									checked={!hiddenColumns.has(col.key)}
									onchange={() => toggleColumn(col.key)}
								/>
								{col.label}
							</label>
						{/each}
					</div>
				{/if}
			</details>

			<button class="icon-btn" aria-label="Add student">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M12 5v14M5 12h14" />
				</svg>
			</button>
		</menu>
	</fieldset>

	<Table columns={visibleColumns} data={filteredData} selectable paginated pageSize={5}>
		{#snippet cell({ column, value })}
			{#if column.key === 'status'}
				<span data-status class:active={value === 'Active'}>
					<span></span>
					{value}
				</span>
			{:else}
				{value ?? ''}
			{/if}
		{/snippet}
	</Table>
</form>

<!------ /HTML ------>

<style>
	iframe {
		height: 100%;
		width: 100%;
	}

	#container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--gap);
	}

	#child {
		min-height: 200px;
		overflow: hidden;
	}

	#child img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Toolbar */
	fieldset {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border: none;
		border-bottom: 1px solid var(--border);
		background: var(--card-bg);
		border-radius: var(--radius) var(--radius) 0 0;
	}

	fieldset > label,
	menu {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	menu {
		margin-left: auto;
	}

	/* Search */
	search {
		position: relative;
		flex: 1;
		max-width: 280px;
	}

	search svg {
		position: absolute;
		left: 0.6rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
		pointer-events: none;
	}

	search input {
		width: 100%;
		padding: 0.4rem 0.65rem 0.4rem 2rem;
		font-size: 0.8rem;
		color: var(--text);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 8px;
		outline: none;
		transition: border-color var(--transition-speed);
	}

	search input::placeholder {
		color: var(--text-muted);
	}

	search input:focus {
		border-color: var(--accent);
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	/* Columns dropdown */
	details {
		position: relative;
		border: none;
		padding: 0;
	}

	summary {
		font-size: 0.8rem;
		font-weight: 500;
		padding: 0.4rem 0.75rem;
		gap: 0.35rem;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	details > div {
		position: absolute;
		top: calc(100% + 4px);
		right: 0;
		z-index: 50;
		min-width: 160px;
		background: var(--card-bg);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0.35rem;
		box-shadow: var(--card-shadow);
		display: flex;
		flex-direction: column;
	}

	details label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.6rem;
		font-size: 0.8rem;
		color: var(--text);
		border-radius: 5px;
		cursor: pointer;
		transition: background-color var(--transition-speed);
	}

	details label:hover {
		background: var(--surface);
	}

	details input[type='checkbox'] {
		width: 14px;
		height: 14px;
		accent-color: var(--accent);
		cursor: pointer;
	}

	/* Status badge */
	[data-status] {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	[data-status] > span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--text-muted);
	}

	[data-status].active > span {
		background: #22c55e;
	}

	[data-status].active {
		color: var(--text);
	}

	/* Responsive */
	@media (max-width: 640px) {
		fieldset {
			flex-wrap: wrap;
		}
		search {
			order: 3;
			max-width: 100%;
			flex-basis: 100%;
		}
	}
</style>
