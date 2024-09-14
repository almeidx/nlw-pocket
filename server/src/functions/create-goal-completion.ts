import dayjs from "dayjs";
import { and, between, count, eq, sql } from "drizzle-orm";
import { db } from "../db/index.ts";
import { goalCompletions, goals } from "../db/schema.ts";

export async function createGoalCompletion({ goalId }: CreateGoalCompletionRequest) {
	const firstDayOfWeek = dayjs().startOf("week").toDate();
	const lastDayOfWeek = dayjs().endOf("week").toDate();

	const goalCompletionCounts = db.$with("goal_completion_counts").as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completionCount: count(goalCompletions.id).as("completionCount"),
			})
			.from(goalCompletions)
			.where(and(between(goalCompletions.createdAt, firstDayOfWeek, lastDayOfWeek), eq(goalCompletions.goalId, goalId)))
			.groupBy(goalCompletions.goalId),
	);

	const [result] = await db
		.with(goalCompletionCounts)
		.select({
			desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
			completionCount: sql`COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith(Number).as("completionCount"),
		})
		.from(goals)
		.leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
		.where(eq(goals.id, goalId));

	if (result) {
		const { completionCount, desiredWeeklyFrequency } = result;

		if (completionCount >= desiredWeeklyFrequency) {
			throw new Error("Goal already completed for the week");
		}
	}

	const [goalCompletion] = await db.insert(goalCompletions).values({ goalId }).returning();

	return { goalCompletion };
}

interface CreateGoalCompletionRequest {
	goalId: string;
}
