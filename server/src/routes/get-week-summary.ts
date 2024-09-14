import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekSummary } from "../functions/get-week-summary.ts";

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/week-summary", async () => {
		const summary = await getWeekSummary();

		return { summary };
	});
};
