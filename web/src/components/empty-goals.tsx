import { Plus } from "lucide-react";
import letsStart from "../assets/lets-start-illustration.svg";
import logo from "../assets/logo-in-orbit.svg";
import { Button } from "./ui/button.tsx";
import { DialogTrigger } from "./ui/dialog.tsx";

export function EmptyGoals() {
	return (
		<div className="flex h-screen flex-col items-center justify-center gap-8">
			<img src={logo} alt="in.orbit" />
			<img src={letsStart} alt="Let's start" />

			<p className="max-w-80 text-center text-zinc-300 leading-relaxed">
				Ainda não cadastraste nenhuma meta, que tal cadastrar uma agora mesmo?
			</p>

			<DialogTrigger asChild>
				<Button>
					<Plus className="size-4" />
					Cadastrar meta
				</Button>
			</DialogTrigger>
		</div>
	);
}
