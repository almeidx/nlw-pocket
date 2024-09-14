import { db } from "../db/index.ts";
import { goals } from "../db/schema.ts";

export async function createGoal({ desiredWeeklyFrequency, title }: CreateGoalRequest) {
	const [goal] = await db.insert(goals).values({ desiredWeeklyFrequency, title }).returning();

	return { goal };
}

interface CreateGoalRequest {
	title: string;
	desiredWeeklyFrequency: number;
}
