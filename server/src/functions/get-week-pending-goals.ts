import dayjs from "dayjs";
import { between, count, eq, lte, sql } from "drizzle-orm";
import { db } from "../db/index.ts";
import { goalCompletions, goals } from "../db/schema.ts";

export async function getWeekPendingGoals() {
	const firstDayOfWeek = dayjs().startOf("week").toDate();
	const lastDayOfWeek = dayjs().endOf("week").toDate();

	const goalsCreatedUpToThisWeek = db.$with("goals_created_up_to_this_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(lte(goals.createdAt, lastDayOfWeek)),
	);

	const goalCompletionCounts = db.$with("goal_completion_counts").as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completionCount: count(goalCompletions.id).as("completionCount"),
			})
			.from(goalCompletions)
			.where(between(goalCompletions.createdAt, firstDayOfWeek, lastDayOfWeek))
			.groupBy(goalCompletions.goalId),
	);

	const pendingGoals = await db
		.with(goalsCreatedUpToThisWeek, goalCompletionCounts)
		.select({
			id: goalsCreatedUpToThisWeek.id,
			title: goalsCreatedUpToThisWeek.title,
			desiredWeeklyFrequency: goalsCreatedUpToThisWeek.desiredWeeklyFrequency,
			completionCount: sql`COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith(Number).as("completionCount"),
		})
		.from(goalsCreatedUpToThisWeek)
		.leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goalsCreatedUpToThisWeek.id));

	return pendingGoals;
}
