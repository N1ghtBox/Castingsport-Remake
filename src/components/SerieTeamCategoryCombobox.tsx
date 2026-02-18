import { Combobox } from "@/components/Combobox";
import { useSerieContext } from "@/context/serie/SerieContext";
import { Categories } from "@/types/Contestant";
import { TeamCategory } from "@/types/Teams";

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

export default function SerieTeamCategoryCombobox() {
	const { setTeamCategory, teamCategory } = useSerieContext();

	return (
		<Combobox
			onChange={(val) => setTeamCategory(val || Categories.Unknown)}
			value={teamCategory}
			options={options}
		/>
	);
}
