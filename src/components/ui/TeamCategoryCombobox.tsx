import type Team from "@/types/Teams";
import { TeamCategory } from "@/types/Teams";
import { TeamContext } from "@/types/TeamsContext";
import React, { useCallback } from "react";
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

export default function TeamCategoryCombobox() {
	const teamContext = React.useContext(TeamContext);

	const updateCategory = useCallback(
		(value: string | undefined) => {
			teamContext.setCategory(value as Team["category"]);
		},
		[teamContext.setCategory],
	);

	return (
		<Combobox
			onChange={updateCategory}
			value={teamContext.category}
			options={options}
		/>
	);
}
