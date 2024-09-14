import fastify from "fastify";
import { type ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { z } from "zod";
import { createGoalCompletion } from "../functions/create-goal-completion.ts";
import { createGoal } from "../functions/create-goal.ts";
import { getWeekPendingGoals } from "../functions/get-week-pending-goals.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/pending-goals", async () => {
	const pendingGoals = await getWeekPendingGoals();

	return { pendingGoals };
});

app.post(
	"/goals",
	{
		schema: {
			body: z.object({
				title: z.string(),
				desiredWeeklyFrequency: z.number().int().min(1).max(7),
			}),
		},
	},
	async (request, reply) => {
		const { title, desiredWeeklyFrequency } = request.body;

		await createGoal({ title, desiredWeeklyFrequency });

		reply.statusCode = 201;
	},
);

app.post(
	"/completions",
	{
		schema: {
			body: z.object({
				goalId: z.string(),
			}),
		},
	},
	async (request, reply) => {
		const { goalId } = request.body;

		await createGoalCompletion({ goalId });

		reply.statusCode = 201;
	},
);

await app.listen({ port: 3333 });

console.log("Server is running on port 3333");
