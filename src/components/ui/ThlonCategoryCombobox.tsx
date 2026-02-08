import { useCallback, useMemo } from "react";
import { useLoaderData } from "react-router";
import { useContestContext } from "@/context/contest/ContestContext";
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
}: {
	allowDeselect?: boolean;
}) {
	const contest = useContestContext();
	const { from, to } = useLoaderData() as { from: number; to: number };

	const updateCategory = useCallback(
		(value: string | undefined) => {
			contest.setCategoryFilter(value as CategoryValues | undefined);
		},
		[contest.setCategoryFilter],
	);

	const categories = useMemo(() => {
		if (from < Contests.Arenberg && to <= Contests.Distance) {
			const returnOptions = options.filter((x) => x.value !== Categories.Kadet);
			if (!returnOptions.some((x) => x.value === contest.category))
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
			if (!returnOptions.some((x) => x.value === contest.category))
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
			if (!returnOptions.some((x) => x.value === contest.category))
				updateCategory(Categories.Man);

			return returnOptions;
		}

		return options;
	}, [from, to, contest.category, updateCategory]);

	return (
		<Combobox
			onChange={updateCategory}
			value={contest.category}
			options={categories}
			allowDeselect={allowDeselect === undefined ? true : allowDeselect}
		/>
	);
}
