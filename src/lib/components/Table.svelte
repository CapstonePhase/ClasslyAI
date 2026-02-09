<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';

	interface Column {
		key: string;
		label: string;
		sortable?: boolean;
		align?: 'left' | 'center' | 'right';
		width?: string;
	}

	interface Props {
		columns: Column[];
		data: Record<string, unknown>[];
		selectable?: boolean;
		paginated?: boolean;
		pageSize?: number;
		pageSizes?: number[];
		hoverable?: boolean;
		cell?: Snippet<[{ row: Record<string, unknown>; column: Column; value: unknown }]>;
		header?: Snippet;
		footer?: Snippet;
	}

	let {
		columns,
		data,
		selectable = false,
		paginated = false,
		pageSize = $bindable(10),
		pageSizes = [10, 20, 50],
		hoverable = true,
		cell,
		header,
		footer
	}: Props = $props();

	// Sorting
	let sortKey = $state<string | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');

	let sortedData = $derived.by(() => {
		if (!sortKey) return data;
		const key = sortKey;

		return [...data].sort((a, b) => {
			const aVal = String(a[key] ?? '');
			const bVal = String(b[key] ?? '');

			if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
			if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
	});

	function handleSort(key: string, sortable: boolean = true) {
		if (!sortable) return;
		if (sortKey === key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDirection = 'asc';
		}
	}

	// Selection
	let selected = new SvelteSet<number>();

	// Pagination
	let currentPage = $state(0);

	const totalPages = $derived(paginated ? Math.max(1, Math.ceil(sortedData.length / pageSize)) : 1);

	const pagedData = $derived(
		paginated ? sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize) : sortedData
	);

	const allSelected = $derived(
		pagedData.length > 0 && pagedData.every((_, i) => selected.has(currentPage * pageSize + i))
	);

	function toggleAll() {
		if (allSelected) {
			pagedData.forEach((_, i) => selected.delete(currentPage * pageSize + i));
		} else {
			pagedData.forEach((_, i) => selected.add(currentPage * pageSize + i));
		}
	}

	function toggleRow(globalIndex: number) {
		if (selected.has(globalIndex)) {
			selected.delete(globalIndex);
		} else {
			selected.add(globalIndex);
		}
	}

	function goTo(page: number) {
		currentPage = Math.max(0, Math.min(page, totalPages - 1));
	}

	function handlePageSizeChange(e: Event) {
		pageSize = Number((e.target as HTMLSelectElement).value);
		currentPage = 0;
	}
</script>

{#snippet pageBtn(onclick: () => void, disabled: boolean, label: string, path: string)}
	<button class="icon-btn" {onclick} {disabled} aria-label={label}>
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path d={path} />
		</svg>
	</button>
{/snippet}

<div class="data-card">
	{#if header}
		<div class="table-header">
			{@render header()}
		</div>
	{/if}

	<div class="table-scroll">
		<table class:hoverable>
			<thead>
				<tr>
					{#if selectable}
						<th class="cell-checkbox">
							<input
								type="checkbox"
								checked={allSelected}
								onchange={toggleAll}
								aria-label="Select all rows"
							/>
						</th>
					{/if}
					{#each columns as column (column.key)}
						<th
							class:sortable={column.sortable !== false}
							class:sorted={sortKey === column.key}
							style={column.width ? `width: ${column.width}` : ''}
							style:text-align={column.align ?? 'left'}
							onclick={() => handleSort(column.key, column.sortable !== false)}
						>
							<span class="th-content">
								{column.label}
								{#if column.sortable !== false && sortKey === column.key}
									<span class="sort-icon">
										{#if sortDirection === 'asc'}
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg
											>
										{:else}
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7" /></svg
											>
										{/if}
									</span>
								{/if}
							</span>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each pagedData as row, i (currentPage * pageSize + i)}
					{@const globalIndex = currentPage * pageSize + i}
					<tr class:selected={selected.has(globalIndex)}>
						{#if selectable}
							<td class="cell-checkbox">
								<input
									type="checkbox"
									checked={selected.has(globalIndex)}
									onchange={() => toggleRow(globalIndex)}
									aria-label="Select row {globalIndex + 1}"
								/>
							</td>
						{/if}
						{#each columns as column (column.key)}
							<td style:text-align={column.align ?? 'left'}>
								{#if cell}
									{@render cell({ row, column, value: row[column.key] })}
								{:else}
									{row[column.key] ?? ''}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if paginated || selectable || footer}
		<div class="table-footer">
			{#if selectable}
				<span class="selection-count">
					{selected.size} of {sortedData.length} row(s) selected.
				</span>
			{/if}

			{#if footer}
				{@render footer()}
			{/if}

			{#if paginated}
				<div class="pagination">
					<div class="page-size">
						<span>Rows per page</span>
						<select class="select" value={String(pageSize)} onchange={handlePageSizeChange}>
							{#each pageSizes as size (size)}
								<option value={String(size)}>{size}</option>
							{/each}
						</select>
					</div>

					<span class="page-info">Page {currentPage + 1} of {totalPages}</span>

					<div class="page-buttons">
						{@render pageBtn(
							() => goTo(0),
							currentPage === 0,
							'First page',
							'M11 17l-5-5 5-5M18 17l-5-5 5-5'
						)}
						{@render pageBtn(
							() => goTo(currentPage - 1),
							currentPage === 0,
							'Previous page',
							'M15 18l-6-6 6-6'
						)}
						{@render pageBtn(
							() => goTo(currentPage + 1),
							currentPage >= totalPages - 1,
							'Next page',
							'M9 18l6-6-6-6'
						)}
						{@render pageBtn(
							() => goTo(totalPages - 1),
							currentPage >= totalPages - 1,
							'Last page',
							'M13 17l5-5-5-5M6 17l5-5-5-5'
						)}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Header slot area */
	.table-header {
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border);
	}

	.table-scroll {
		overflow-x: auto;
	}

	/* Sorting */
	.th-content {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	th.sortable {
		cursor: pointer;
		transition: color var(--transition-speed);
	}

	th.sortable:hover,
	th.sorted {
		color: var(--text);
	}

	.sort-icon {
		display: inline-flex;
		opacity: 0.7;
	}

	/* Hoverable rows */
	table.hoverable tbody tr {
		transition: background-color var(--transition-speed);
	}

	table.hoverable tbody tr:hover {
		background: var(--surface);
	}

	tr.selected {
		background: var(--surface);
	}

	/* Checkbox cell */
	.cell-checkbox {
		width: 40px;
		padding-left: 1rem;
		padding-right: 0;
	}

	.cell-checkbox input[type='checkbox'] {
		width: 16px;
		height: 16px;
		accent-color: var(--accent);
		cursor: pointer;
		border-radius: 3px;
	}

	/* Footer */
	.table-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--border);
		font-size: 0.8rem;
		color: var(--text-muted);
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.selection-count {
		flex-shrink: 0;
	}

	/* Pagination layout */
	.pagination {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-left: auto;
	}

	.page-size {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.page-info {
		white-space: nowrap;
	}

	.page-buttons {
		display: flex;
		gap: 0.25rem;
	}

	@media (max-width: 640px) {
		.table-footer {
			flex-direction: column;
			align-items: flex-start;
		}
		.pagination {
			margin-left: 0;
			flex-wrap: wrap;
		}
	}
</style>
