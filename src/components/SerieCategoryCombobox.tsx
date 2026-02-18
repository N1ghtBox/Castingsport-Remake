import { useMemo } from "react";
import { useLoaderData } from "react-router";
import { Combobox } from "@/components/Combobox";
import { useSerieContext } from "@/context/serie/SerieContext";
import { Categories } from "@/types/Contestant";
import { getThlonEnumName } from "@/utils/contestUtils";

const options = [
	{
		label: "Juniorzy",
		value: Categories.Junior,
	},
	{
		label: "Juniorki",
		value: Categories.Juniorka,
	},
	{
		label: "Mężczyźni",
		value: Categories.Man,
	},
	{
		label: "Kobiety",
		value: Categories.Kobieta,
	},
];

export default function SerieCategoryCombobox() {
	const { setCategory, category } = useSerieContext();
	const { from, to } = useLoaderData();

	const filteredOptions = useMemo(() => {
		const thlonName = getThlonEnumName(from, to);
		if (
			thlonName !== "distance" &&
			thlonName !== "multi" &&
			thlonName !== "9boj"
		)
			return options;

		return options.slice(2);
	}, [from, to]);

	return (
		<Combobox
			onChange={(val) => setCategory(val || Categories.Unknown)}
			value={category}
			options={filteredOptions}
		/>
	);
}
