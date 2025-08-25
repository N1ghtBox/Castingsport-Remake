"use client";

import clsx from "clsx";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ComboboxOption = {
	label: string;
	value: string;
};

type ComboboxProps = {
	onChange: (value?: string) => void;
	value?: string;
	options: ComboboxOption[];
	allowDeselect?: boolean;
	placeholder?: string;
	className?: string;
	error?: string;
};

export function Combobox({
	onChange,
	value,
	options,
	allowDeselect,
	placeholder = "Wybierz kategorie...",
	className = "",
	error = "",
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<div className="flex flex-col">
				<PopoverTrigger>
					<Button
						variant={"outline"}
						role="combobox"
						aria-expanded={open}
						className={clsx("min-w-fit w-[200px] justify-between", className, error ? "border-red-800" : "")}>
						{value
							? options.find((option) => option.value === value)?.label
							: placeholder}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>

				</PopoverTrigger>
				<span className="text-red-800 " style={{ fontSize: '.8rem' }}>
					{error}
				</span>
			</div>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(currentValue) => {
										onChange(
											currentValue === value && allowDeselect
												? undefined
												: currentValue,
										);
										setOpen(false);
									}}>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === option.value ? "opacity-100" : "opacity-0",
										)}
									/>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
