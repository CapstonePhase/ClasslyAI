<script lang="ts">
	interface Dataset {
		label: string;
		values: number[];
		color?: string;
		opacity?: number;
	}

	interface Props {
		title?: string;
		subtitle?: string;
		labels: string[];
		datasets: Dataset[];
		timeRanges?: string[];
		selectedRange?: string;
		onrangechange?: (range: string) => void;
		height?: number;
	}

	let {
		title = 'Total Visitors',
		subtitle = 'Total for the last 3 months',
		labels,
		datasets,
		timeRanges = [],
		selectedRange = $bindable(''),
		onrangechange,
		height = 280
	}: Props = $props();

	const padding = { top: 20, right: 20, bottom: 40, left: 20 };

	let containerWidth = $state(600);
	let containerEl: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!containerEl) return;
		const observer = new ResizeObserver((entries) => {
			containerWidth = entries[0].contentRect.width;
		});
		observer.observe(containerEl);
		return () => observer.disconnect();
	});

	const chartWidth = $derived(containerWidth - padding.left - padding.right);
	const chartHeight = $derived(height - padding.top - padding.bottom);

	const maxValue = $derived(Math.max(...datasets.flatMap((d) => d.values)) * 1.15);

	function scaleX(index: number, total: number): number {
		return (index / (total - 1)) * chartWidth;
	}

	function scaleY(value: number): number {
		return chartHeight - (value / maxValue) * chartHeight;
	}

	/** Compute control points for a smooth cubic Bézier spline */
	function smoothPath(values: number[]): string {
		const points = values.map((v, i) => ({
			x: scaleX(i, values.length),
			y: scaleY(v)
		}));

		if (points.length < 2) return '';

		let d = `M ${points[0].x},${points[0].y}`;

		for (let i = 0; i < points.length - 1; i++) {
			const p0 = points[Math.max(i - 1, 0)];
			const p1 = points[i];
			const p2 = points[i + 1];
			const p3 = points[Math.min(i + 2, points.length - 1)];

			const tension = 0.35;
			const cp1x = p1.x + (p2.x - p0.x) * tension;
			const cp1y = p1.y + (p2.y - p0.y) * tension;
			const cp2x = p2.x - (p3.x - p1.x) * tension;
			const cp2y = p2.y - (p3.y - p1.y) * tension;

			d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
		}

		return d;
	}

	function areaPath(values: number[]): string {
		const line = smoothPath(values);
		const lastX = scaleX(values.length - 1, values.length);
		return `${line} L ${lastX},${chartHeight} L 0,${chartHeight} Z`;
	}

	const gridLines = $derived(Array.from({ length: 4 }, (_, i) => (chartHeight / 4) * (i + 1)));

	const defaultColors = ['var(--accent)', 'var(--icon)'];

	function handleRangeChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		selectedRange = target.value;
		onrangechange?.(target.value);
	}
</script>

<div class="data-card chart-card" bind:this={containerEl}>
	<div class="chart-header">
		<div class="chart-title-group">
			{#if title}
				<h3 class="chart-title">{title}</h3>
			{/if}
			{#if subtitle}
				<p class="chart-subtitle">{subtitle}</p>
			{/if}
		</div>
		{#if timeRanges.length > 0}
			<select class="select range-select" value={selectedRange} onchange={handleRangeChange}>
				{#each timeRanges as range (range)}
					<option value={range}>{range}</option>
				{/each}
			</select>
		{/if}
	</div>

	<svg width="100%" {height} viewBox="0 0 {containerWidth} {height}" preserveAspectRatio="none">
		<defs>
			{#each datasets as dataset, i (dataset.label)}
				<linearGradient id="gradient-{i}" x1="0" y1="0" x2="0" y2="1">
					<stop
						offset="0%"
						stop-color={dataset.color ?? defaultColors[i % defaultColors.length]}
						stop-opacity={dataset.opacity ?? 0.35}
					/>
					<stop
						offset="100%"
						stop-color={dataset.color ?? defaultColors[i % defaultColors.length]}
						stop-opacity={0.01}
					/>
				</linearGradient>
			{/each}
		</defs>

		<g transform="translate({padding.left},{padding.top})">
			<!-- Grid lines -->
			{#each gridLines as y (y)}
				<line x1={0} y1={y} x2={chartWidth} y2={y} class="grid-line" />
			{/each}

			<!-- Area fills + lines (render in reverse so first dataset is on top) -->
			{#each [...datasets].reverse() as dataset, ri (dataset.label)}
				{@const i = datasets.length - 1 - ri}
				<path d={areaPath(dataset.values)} fill="url(#gradient-{i})" class="area-fill" />
				<path
					d={smoothPath(dataset.values)}
					fill="none"
					stroke={dataset.color ?? defaultColors[i % defaultColors.length]}
					stroke-width="2"
					class="area-line"
				/>
			{/each}

			<!-- X-axis labels -->
			{#each labels as label, i (label)}
				<text
					x={scaleX(i, labels.length)}
					y={chartHeight + 28}
					class="axis-label"
					text-anchor="middle"
				>
					{label}
				</text>
			{/each}
		</g>
	</svg>

	<!-- Legend -->
	{#if datasets.length > 1}
		<div class="chart-legend">
			{#each datasets as dataset, i (dataset.label)}
				<div class="legend-item">
					<span
						class="legend-dot"
						style="background: {dataset.color ?? defaultColors[i % defaultColors.length]}"
					></span>
					<span class="legend-label">{dataset.label}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.chart-card {
		padding: 1.5rem;
		box-shadow: var(--card-shadow);
		transition: box-shadow var(--transition-speed);
	}

	.chart-card:hover {
		box-shadow: var(--card-shadow-hover);
	}

	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.25rem;
	}

	.chart-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text);
		margin: 0;
	}

	.chart-subtitle {
		font-size: 0.8rem;
		color: var(--text-muted);
		margin: 0.2rem 0 0;
	}

	.range-select {
		border-radius: 8px;
		padding: 0.4rem 2rem 0.4rem 0.75rem;
		font-weight: 500;
		background-position: right 0.6rem center;
	}

	svg {
		display: block;
		overflow: visible;
	}

	.grid-line {
		stroke: var(--border);
		stroke-width: 1;
	}

	.area-fill {
		transition: opacity var(--transition-speed);
	}

	.area-line {
		transition: opacity var(--transition-speed);
	}

	.axis-label {
		fill: var(--text-muted);
		font-size: 0.75rem;
		font-family: inherit;
	}

	.chart-legend {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.legend-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.legend-label {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
</style>
