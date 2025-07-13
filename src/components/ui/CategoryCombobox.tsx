import { ContestContext } from "@/types/ContestContext";
import { Categories, type CategoryValues, Contests } from "@/types/Contestant";
import React, { useCallback, useMemo } from "react";
import { useLoaderData } from "react-router";
import { Combobox } from "../Combobox";

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

export default function CategoryCombobox({
	allowDeselect,
}: {
	allowDeselect?: boolean;
}) {
	const contest = React.useContext(ContestContext);
	const contestId = useLoaderData() as number;

	const updateCategory = useCallback(
		(value: string | undefined) => {
			contest.setCategoryFilter(value as CategoryValues | undefined);
		},
		[contest.setCategoryFilter],
	);

	const categories = useMemo(() => {
		if (
			contestId === Contests.MultiSkish ||
			contestId === Contests.DistanceDoubleHand ||
			contestId === Contests.FlyDistanceDoubleHand ||
			contestId === Contests.MultiDistance
		) {
			const returnOptions = options.filter(
				(x) => x.value !== Categories.Junior && x.value !== Categories.Juniorka,
			);
			if (!returnOptions.some((x) => x.value === contest.category))
				updateCategory(undefined);

			return returnOptions;
		}

		return options;
	}, [contestId, contest.category, updateCategory]);

	return (
		<Combobox
			onChange={updateCategory}
			value={contest.category}
			options={categories}
			allowDeselect={allowDeselect === undefined ? true : allowDeselect}
		/>
	);
}
