export async function getPendingGoals() {
	const response = await fetch("http://localhost:3333/pending-goals");
	const data = (await response.json()) as GetPendingGoalsResponse;

	return data.pendingGoals;
}

interface GetPendingGoalsResponse {
	pendingGoals: {
		id: string;
		title: string;
		desiredWeeklyFrequency: number;
		completionCount: number;
	}[];
}
