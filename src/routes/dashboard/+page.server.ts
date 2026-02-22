import mockDb from '$lib/data/db.json';

export const load = async () => {
	// Mimic database latency
	await new Promise((resolve) => setTimeout(resolve, 200));

	return {
		// 1. Cast the columns to your new global type (fixes the Table error)
		tableColumns: mockDb.columns as App.Column[],

		// 2. Pass the student data
		students: mockDb.tableData,

		// 3. THIS WAS MISSING: Pass the chart data so +page.svelte can use it
		chart: {
			labels: mockDb.chartLabels,
			datasets: mockDb.chartDatasets
		}
	};
};
