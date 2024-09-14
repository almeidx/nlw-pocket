import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { type ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createGoalCompletionRoute } from "../routes/create-completion.ts";
import { createGoalRoute } from "../routes/create-goal.ts";
import { getPendingGoalsRoute } from "../routes/get-pending-goals.ts";
import { getWeekSummaryRoute } from "../routes/get-week-summary.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifyCors, {
	origin: "*",
});

await app.register(getPendingGoalsRoute);
await app.register(getWeekSummaryRoute);
await app.register(createGoalRoute);
await app.register(createGoalCompletionRoute);

await app.listen({ port: 3333 });

console.log("Server is running on port 3333");
