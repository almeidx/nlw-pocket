import { valibotResolver } from "@hookform/resolvers/valibot";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { type InferOutput, integer, maxValue, minLength, minValue, object, pipe, string, transform } from "valibot";
import { createGoal } from "../http/create-goal.ts";
import { Button } from "./ui/button.tsx";
import { DialogClose, DialogDescription, DialogTitle } from "./ui/dialog.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from "./ui/radio-group.tsx";

const frequencyEmojis = ["🥱", "🙂", "😎", "😜", "🤨", "🤯", "🔥"];

const createGoalForm = object({
	title: pipe(string(), minLength(1, "Informe a atividade que deseja realizar")),
	desiredWeeklyFrequency: pipe(
		string(),
		transform(Number),
		integer(),
		minValue(1, "Informe a frequência semanal"),
		maxValue(7, "Informe uma frequência semanal válida"),
	),
});

type CreateGoalForm = InferOutput<typeof createGoalForm>;

export function CreateGoal() {
	const queryClient = useQueryClient();

	const { register, control, handleSubmit, formState, reset } = useForm<CreateGoalForm>({
		resolver: valibotResolver(createGoalForm),
	});

	async function handleCreateGoal({ title, desiredWeeklyFrequency }: CreateGoalForm) {
		await createGoal({ title, desiredWeeklyFrequency });

		queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
		queryClient.invalidateQueries({ queryKey: ["summary"] });

		reset();
	}

	return (
		<div className="flex h-full flex-col gap-6">
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<DialogTitle>Cadastrar meta</DialogTitle>
					<DialogClose>
						<X className="size-5 text-zinc-600" />
					</DialogClose>
				</div>

				<DialogDescription>
					Adiciona atividades que te fazem bem e que queres continuar a praticar durante a semana.
				</DialogDescription>
			</div>

			<form className="flex flex-1 flex-col justify-between" onSubmit={handleSubmit(handleCreateGoal)}>
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<Label htmlFor="title">Qual é a atividade?</Label>
						<Input autoFocus placeholder="Fazer exercício, meditar, etc..." id="title" {...register("title")} />

						{formState.errors.title && <span className="text-red-500 text-sm">{formState.errors.title.message}</span>}
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="">Quantas vezes por semana?</Label>

						<Controller
							control={control}
							name="desiredWeeklyFrequency"
							defaultValue={3}
							render={({ field }) => (
								<RadioGroup onValueChange={field.onChange} value={String(field.value)}>
									{frequencyEmojis.map((emoji, index) => (
										<RadioGroupItem value={String(index + 1)} key={emoji}>
											<RadioGroupIndicator />

											<span className="font-medium text-sm text-zinc-300 leading-none">
												{index === 6 ? "Todos os dias da semana" : `${index + 1}x por semana`}
											</span>

											<span className="text-lg leading-none">{emoji}</span>
										</RadioGroupItem>
									))}
								</RadioGroup>
							)}
						/>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<DialogClose asChild>
						<Button className="flex-1" variant="secondary" type="button">
							Fechar
						</Button>
					</DialogClose>
					<Button className="flex-1">Guardar</Button>
				</div>
			</form>
		</div>
	);
}
