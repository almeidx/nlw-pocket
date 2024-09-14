import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import dayjsPtLocale from "dayjs/locale/pt";
import { CheckCircle2, Plus } from "lucide-react";
import { getSummary } from "../http/get-summary.ts";
import { InOrbitIcon } from "./in-orbit-icon.tsx";
import { PendingGoals } from "./pending-goals.tsx";
import { Button } from "./ui/button.tsx";
import { DialogTrigger } from "./ui/dialog.tsx";
import { Progress, ProgressIndicator } from "./ui/progress-bar.tsx";
import { Separator } from "./ui/separator.tsx";

dayjs.locale(dayjsPtLocale);

export function Summary() {
	const { data } = useQuery({
		queryKey: ["summary"],
		queryFn: getSummary,
		staleTime: 60 * 1_000, // 1 minute
	});

	if (!data) {
		return null;
	}

	const firstDayOfWeek = dayjs().startOf("week").format("D MMM");
	const lastDayOfWeek = dayjs().endOf("week").format("D MMM");

	const completedPercentage = Math.round((data.completed / data.total) * 100);

	return (
		<div className="mx-auto flex max-w-[480px] flex-col gap-6 px-5 py-10">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<InOrbitIcon />
					<span className="font-semibold text-lg">
						{firstDayOfWeek} - {lastDayOfWeek}
					</span>
				</div>

				<DialogTrigger asChild>
					<Button size="sm">
						<Plus className="size-4" />
						Cadastrar meta
					</Button>
				</DialogTrigger>
			</div>

			<div className="flex flex-col gap-3">
				<Progress value={8} max={15}>
					<ProgressIndicator style={{ width: `${completedPercentage}%` }} />
				</Progress>

				<div className="flex items-center justify-between text-xs text-zinc-400">
					<span>
						Completaste <span className="text-zinc-100">{data?.completed}</span> de{" "}
						<span className="text-zinc-100">{data?.total}</span> metas esta semana.
					</span>
					<span>{completedPercentage}%</span>
				</div>
			</div>

			<Separator />

			<PendingGoals />

			<div className="flex flex-col gap-6">
				<h2 className="font-medium text-xl">A tua semana</h2>

				{Object.entries(data.goalsPerDay).map(([date, goals]) => {
					const weekDay = dayjs(date).format("dddd");
					const formattedDate = dayjs(date).format("D [de] MMMM");

					return (
						<div className="flex flex-col gap-4" key={date}>
							<h3 className="font-medium">
								<span className="capitalize">{weekDay}</span>{" "}
								<span className="text-xs text-zinc-400">({formattedDate})</span>
							</h3>

							<ul className="flex flex-col gap-3">
								{goals.map((goal) => {
									const time = dayjs(goal.completedAt).format("HH:mm[h]");

									return (
										<li className="flex items-center gap-2" key={goal.id}>
											<CheckCircle2 className="size-4 text-pink-500" />
											<span className="text-sm text-zinc-400">
												Completaste "<span className="text-zinc-100">{goal.title}</span>" às{" "}
												<span className="text-zinc-100">{time}</span>
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					);
				})}
			</div>
		</div>
	);
}
