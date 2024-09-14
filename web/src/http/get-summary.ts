export async function getSummary() {
	const response = await fetch("http://localhost:3333/week-summary");
	const data = (await response.json()) as GetSummaryResponse;

	return data.summary;
}

interface GetSummaryResponse {
	summary: {
		completed: number;
		total: number;
		goalsPerDay: Record<
			string,
			{
				id: string;
				title: string;
				completedAt: string;
			}[]
		>;
	};
}
