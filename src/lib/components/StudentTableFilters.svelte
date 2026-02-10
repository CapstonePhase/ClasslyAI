<script lang="ts">
	import Icon from './Icon.svelte';
	import MenuBar from './MenuBar.svelte';
	interface Column {
		key: string;
		label: string;
		sortable?: boolean;
		align?: 'left' | 'center' | 'right';
		width?: string;
	}

	let {
		statusFilter = $bindable('all'),
		courseFilter = $bindable('all'),
		searchQuery = $bindable(''),
		courses = [],
		columns = [],
		hiddenColumns = new Set<string>(),
		columnsOpen = $bindable(false),
		toggleColumn
	}: {
		statusFilter?: string;
		courseFilter?: string;
		searchQuery?: string;
		courses?: string[];
		columns?: Column[];
		hiddenColumns?: Set<string>;
		columnsOpen?: boolean;
		toggleColumn?: (key: string) => void;
	} = $props();

	const CHEVRON = 'M6 9l6 6 6-6';
	const PLUS = 'M12 5v14M5 12h14';
</script>

<MenuBar ariaLabelledby="filters-legend" className="toolbar">
	<div slot="legend">
		<span>Student table filters</span>
	</div>

	<div>
		<label class="filter-group">
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

		<search class="search-field">
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
			<input
				class="input"
				type="search"
				placeholder="Search students..."
				bind:value={searchQuery}
			/>
		</search>
	</div>

	<div slot="actions">
		<details class="dropdown" bind:open={columnsOpen}>
			<summary
				class="btn btn-ghost"
				onclick={(e) => {
					e.preventDefault();
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
				<Icon path={CHEVRON} size={10} />
			</summary>
			<div class="dropdown-panel">
				{#each columns as col (col.key)}
					<label>
						<input
							type="checkbox"
							checked={!hiddenColumns.has(col.key)}
							onchange={() => toggleColumn?.(col.key)}
						/>
						{col.label}
					</label>
				{/each}
			</div>
		</details>
		<button class="icon-btn" aria-label="Add student">
			<Icon path={PLUS} size={16} />
		</button>
	</div>
</MenuBar>

<style>
	/* Filter group: component-local rule */
	.filter-group {
		display: contents;
	}

	/* Dropdown styles live in `app.css` — keep this file focused on structure only. */
</style>
