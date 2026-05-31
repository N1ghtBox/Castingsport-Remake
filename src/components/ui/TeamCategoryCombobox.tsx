import { useCallback } from "react";
import { useTeamContext } from "@/context/team/TeamContext";
import type { Team } from "@/types/Teams";
import { TeamCategory } from "@/types/Teams";
import { Combobox } from "../Combobox";

const options = [
	{
		label: "Młodzieży",
		value: TeamCategory.Junior,
	},
	{
		label: "Seniorów",
		value: TeamCategory.Senior,
	},
	{
		label: "Kobiet",
		value: TeamCategory.Women,
	},
];

export default function TeamCategoryCombobox({ placeholder }: { placeholder?: string }) {
	const { setCategory, category } = useTeamContext();

	const updateCategory = useCallback(
		(value: string | undefined) => {
			setCategory(value as Team["category"]);
		},
		[setCategory],
	);

	return (
		<Combobox
			onChange={updateCategory}
			value={category}
			options={options}
			allowDeselect
			placeholder={placeholder}
		/>
	);
}
