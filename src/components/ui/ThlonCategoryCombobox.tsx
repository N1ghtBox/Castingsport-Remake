import { useCallback, useMemo } from "react";
import { useThlonContext } from "@/context/thlon/ThlonContext";
import { Categories, type CategoryValues, Contests } from "@/types/Contestant";
import { Combobox } from "../Combobox";

const options = [
	{
		label: "Kadeci",
		value: Categories.Kadet,
	},
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

export default function ThlonCategoryCombobox({
	allowDeselect,
	placeholder,
}: {
	allowDeselect?: boolean;
	placeholder?: string;
}) {
	const { thlon: { from, to }, setCategoryFilter, category } = useThlonContext();

	const updateCategory = useCallback(
		(value: string | undefined) => {
			setCategoryFilter(value as CategoryValues | undefined);
		},
		[setCategoryFilter],
	);

	const categories = useMemo(() => {
		if (from < Contests.Arenberg && to <= Contests.Distance) {
			const returnOptions = options.filter((x) => x.value !== Categories.Kadet);
			if (!returnOptions.some((x) => x.value === category))
				updateCategory(Categories.Man);

			return returnOptions;
		}

		if (from > Contests.Distance) {
			const returnOptions = options.filter(
				(x) =>
					x.value !== Categories.Junior &&
					x.value !== Categories.Juniorka &&
					x.value !== Categories.Kadet,
			);
			if (!returnOptions.some((x) => x.value === category))
				updateCategory(Categories.Man);

			return returnOptions;
		}

		if (to > Contests.Distance) {
			const returnOptions = options.filter(
				(x) =>
					x.value !== Categories.Junior &&
					x.value !== Categories.Juniorka &&
					x.value !== Categories.Kadet,
			);
			if (!returnOptions.some((x) => x.value === category))
				updateCategory(Categories.Man);

			return returnOptions;
		}

		return options;
	}, [from, to, category, updateCategory]);

	return (
		<Combobox
			onChange={updateCategory}
			value={category}
			options={categories}
			allowDeselect={allowDeselect === undefined ? true : allowDeselect}
			placeholder={placeholder}
		/>
	);
}
