import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function Label(props: ComponentProps<"label">) {
	// biome-ignore lint/a11y/noLabelWithoutControl: Component accepts props
	return <label {...props} className={twMerge("font-medium text-sm leading-normal tracking-tight", props.className)} />;
}
