import { useQuery } from "@tanstack/react-query";
import { CreateGoal } from "./components/create-goal.tsx";
import { EmptyGoals } from "./components/empty-goals.tsx";
import { Summary } from "./components/summary.tsx";
import { Dialog, DialogContent } from "./components/ui/dialog.tsx";
import { getSummary } from "./http/get-summary.ts";

export function App() {
	const { data } = useQuery({
		queryKey: ["summary"],
		queryFn: getSummary,
		staleTime: 60 * 1_000, // 1 minute
	});

	return (
		<Dialog>
			{data && data.total > 0 ? <Summary /> : <EmptyGoals />}

			<DialogContent>
				<CreateGoal />
			</DialogContent>
		</Dialog>
	);
}
