<script module lang="ts">
	// Exporting the type here allows the parent to import it!
	export interface TableColumn<T> {
		key: keyof T;
		label: string;
		sortable?: boolean;
		align?: 'left' | 'center' | 'right';
		width?: string;
	}
</script>

<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		data: T[];
		columns: TableColumn<T>[];
		pageSize?: number;
		paginated?: boolean;
		selectable?: boolean;
		// Snippets for custom rendering
		rowSnippet?: Snippet<[T]>;
		emptySnippet?: Snippet;
	}

	let {
		data,
		columns,
		pageSize = 10,
		paginated = false,
		selectable = false,
		rowSnippet,
		emptySnippet
	}: Props = $props();

	// State
	let sortKey = $state<keyof T | null>(null);
	let sortDirection = $state<'asc' | 'desc'>('asc');
	let currentPage = $state(0);

	// Fixed: Use SvelteSet for fine-grained reactivity
	let selectedRows = new SvelteSet<number>();

	// Derived: Sorting
	let sortedData = $derived.by(() => {
		if (!sortKey) return data;

		return [...data].sort((a, b) => {
			const aVal = String(a[sortKey!] ?? '');
			const bVal = String(b[sortKey!] ?? '');

			if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
			if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
	});

	// Derived: Pagination
	let totalPages = $derived(paginated ? Math.ceil(sortedData.length / pageSize) : 1);
	let pagedData = $derived(
		paginated ? sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize) : sortedData
	);

	function handleSort(column: TableColumn<T>) {
		if (column.sortable === false) return;

		if (sortKey === column.key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = column.key;
			sortDirection = 'asc';
		}
	}

	function toggleSelect(index: number) {
		// Fixed: No need to reassign new Set(), SvelteSet handles it
		if (selectedRows.has(index)) {
			selectedRows.delete(index);
		} else {
			selectedRows.add(index);
		}
	}
</script>

<div class="table-container">
	<div class="table-scroll">
		<table>
			<thead>
				<tr>
					{#if selectable}
						<th class="w-10">
							<input type="checkbox" disabled />
						</th>
					{/if}
					{#each columns as col (col.key)}
						<th
							class:sortable={col.sortable !== false}
							onclick={() => handleSort(col)}
							style:text-align={col.align || 'left'}
							style:width={col.width}
						>
							<div
								class="th-content"
								style:justify-content={col.align === 'center'
									? 'center'
									: col.align === 'right'
										? 'flex-end'
										: 'flex-start'}
							>
								{col.label}
								{#if sortKey === col.key}
									<span class="sort-indicator">{sortDirection === 'asc' ? '↑' : '↓'}</span>
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#if pagedData.length > 0}
					{#each pagedData as row, i (row)}
						<tr class:selected={selectedRows.has(i)}>
							{#if selectable}
								<td class="w-10 text-center">
									<input
										type="checkbox"
										checked={selectedRows.has(i)}
										onchange={() => toggleSelect(i)}
									/>
								</td>
							{/if}

							{#if rowSnippet}
								{@render rowSnippet(row)}
							{:else}
								{#each columns as col (col.key)}
									<td style:text-align={col.align || 'left'}>
										{String(row[col.key] ?? '')}
									</td>
								{/each}
							{/if}
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={columns.length + (selectable ? 1 : 0)} class="empty">
							{#if emptySnippet}
								{@render emptySnippet()}
							{:else}
								No data available.
							{/if}
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	{#if paginated && totalPages > 1}
		<div class="pagination">
			<span class="page-info">Page {currentPage + 1} of {totalPages}</span>
			<div class="actions">
				<button disabled={currentPage === 0} onclick={() => currentPage--}>Prev</button>
				<button disabled={currentPage >= totalPages - 1} onclick={() => currentPage++}>Next</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.table-container {
		width: 100%;
		border: 1px solid var(--color-border, #eee);
		border-radius: 0.75rem;
		overflow: hidden;
		background: var(--color-surface, #fff);
	}

	.table-scroll {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	th,
	td {
		padding: 0.875rem 1rem;
		border-bottom: 1px solid var(--color-border, #eee);
		color: var(--color-text, #333);
	}

	th {
		background: var(--color-surface-soft, #f9fafb);
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		color: var(--color-text-muted, #666);
		user-select: none;
	}

	th.sortable {
		cursor: pointer;
		transition: color 0.2s;
	}
	th.sortable:hover {
		color: var(--color-accent, #007bff);
	}

	tr:last-child td {
		border-bottom: none;
	}
	tr:hover td {
		background: var(--color-surface-soft, #f9fafb);
	}
	tr.selected td {
		background: #eff6ff;
	} /* Light blue tint */

	.th-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.w-10 {
		width: 2.5rem;
	}
	.text-center {
		text-align: center;
	}
	.empty {
		text-align: center;
		padding: 3rem;
		color: var(--color-text-muted);
	}

	.pagination {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--color-surface-soft);
		border-top: 1px solid var(--color-border);
	}

	button {
		padding: 0.25rem 0.75rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 0.8rem;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
