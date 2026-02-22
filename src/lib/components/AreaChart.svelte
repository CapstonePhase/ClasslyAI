<script lang="ts">
	interface ChartDataset {
		label: string;
		data: number[];
		color?: string;
	}

	let {
		labels = [],
		datasets = [],
		height = 300,
		showGrid = true
	}: {
		labels: string[];
		datasets: ChartDataset[];
		height?: number;
		showGrid?: boolean;
	} = $props();

	// Calculate Max Value with a buffer so the top line isn't stuck to the ceiling
	let maxValue = $derived.by(() => {
		const max = Math.max(...datasets.flatMap((d) => d.data), 10);
		return Math.ceil(max * 1.05); // Add 5% headroom
	});

	// Generate the line path (stroke)
	function getLinePath(values: number[]) {
		if (values.length === 0) return '';
		const stepX = 100 / (values.length - 1);

		return values
			.map((val, i) => {
				const x = i * stepX;
				const y = 100 - (val / maxValue) * 100;
				return `${x},${y}`;
			})
			.join(' L ');
	}

	// Generate the area path (fill)
	function getAreaPath(values: number[]) {
		if (values.length === 0) return '';
		const linePath = getLinePath(values).replaceAll('L', 'L'); // Format consistency
		return `M 0,100 L ${linePath} L 100,100 Z`;
	}
</script>

<div class="chart-card" style:height="{height}px">
	<div class="y-axis">
		<span>{maxValue}</span>
		<span>{Math.round(maxValue / 2)}</span>
		<span>0</span>
	</div>

	<div class="chart-canvas">
		{#if showGrid}
			<div class="grid-lines">
				<div class="line"></div>
				<div class="line"></div>
				<div class="line"></div>
			</div>
		{/if}

		<svg viewBox="0 0 100 100" preserveAspectRatio="none">
			<defs>
				{#each datasets as ds, i (ds.label)}
					<linearGradient id="gradient-{i}" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stop-color={ds.color || 'var(--color-accent)'} stop-opacity="0.4" />
						<stop offset="100%" stop-color={ds.color || 'var(--color-accent)'} stop-opacity="0" />
					</linearGradient>
				{/each}
			</defs>

			{#each datasets as ds, i (ds.label)}
				<path d={getAreaPath(ds.data)} fill="url(#gradient-{i})" stroke="none" />
				<path
					d={`M ${getLinePath(ds.data)}`}
					fill="none"
					stroke={ds.color || 'var(--color-accent)'}
					stroke-width="2px"
					vector-effect="non-scaling-stroke"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{/each}
		</svg>

		<div class="x-axis">
			{#each labels as label, i (i)}
				<span class="x-label" style:left="{(i / (labels.length - 1)) * 100}%">
					{label}
				</span>
			{/each}
		</div>
	</div>
</div>

<style>
	.chart-card {
		display: flex;
		width: 100%;
		font-size: 0.75rem;
		background-color: var(--color-surface); /* Card background */
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 1.5rem; /* Inner padding prevents clipping */
		gap: 1rem;
		box-shadow: var(--shadow-card);
	}

	.y-axis {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: var(--color-text-muted);
		padding-bottom: 1.5rem; /* Space for x-axis */
		font-variant-numeric: tabular-nums;
	}

	.chart-canvas {
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	/* Grid Lines Logic */
	.grid-lines {
		position: absolute;
		inset: 0 0 1.5rem 0; /* Cover chart area, stop above x-axis */
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: none;
		z-index: 0;
	}

	.line {
		width: 100%;
		border-top: 1px dashed var(--color-border);
		opacity: 0.6;
	}
	/* Add bottom border to the last line manually if needed, or rely on axis */
	.line:last-child {
		border-top: 1px solid var(--color-border);
		/* Solid base line */
	}

	svg {
		flex: 1;
		width: 100%;
		height: 100%; /* Important */
		overflow: visible;
		/* Allows stroke to bleed slightly without clipping */
		z-index: 1;
		margin-bottom: 1.5rem; /* Space for x-axis labels */
	}

	.x-axis {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1rem;
		pointer-events: none;
	}

	.x-label {
		position: absolute;
		transform: translateX(-50%);
		/* Center label on the point */
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	/* Prevent first and last labels from going off-edge */
	.x-label:first-child {
		transform: translateX(0%);
	}
	.x-label:last-child {
		transform: translateX(-100%);
	}
</style>
