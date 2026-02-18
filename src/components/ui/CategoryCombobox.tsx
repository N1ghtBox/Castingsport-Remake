import { useCallback, useMemo } from "react";
import { useLoaderData } from "react-router";
import { useContestContext } from "@/context/contest/ContestContext";
import { Categories, type CategoryValues, Contests, ValidCategories } from "@/types/Contestant";
import { Combobox } from "../Combobox";

const options = ValidCategories
	.map(val => ({ value: val, label: val }));

export default function CategoryCombobox({
	allowDeselect,
}: {
	allowDeselect?: boolean;
}) {
	const { setCategoryFilter, category } = useContestContext();
	const contestId = useLoaderData();

	const updateCategory = useCallback(
		(value: string | undefined) => {
			setCategoryFilter(value as CategoryValues | undefined);
		},
		[setCategoryFilter],
	);

	const categories = useMemo(() => {
		let returnOptions = options;
		if (contestId === Contests.FlyDistance || contestId === Contests.FlySkish) {
			returnOptions = returnOptions.filter((x) => x.value !== Categories.Kadet);
		}

		if (
			contestId === Contests.MultiSkish ||
			contestId === Contests.DistanceDoubleHand ||
			contestId === Contests.FlyDistanceDoubleHand ||
			contestId === Contests.MultiDistance
		) {
			returnOptions = returnOptions.filter(
				(x) =>
					x.value !== Categories.Junior &&
					x.value !== Categories.Juniorka &&
					x.value !== Categories.Kadet,
			);
		}

		if (!returnOptions.some((x) => x.value === category))
			updateCategory(undefined);

		return returnOptions;
	}, [contestId, category, updateCategory]);

	return (
		<Combobox
			onChange={updateCategory}
			value={category}
			options={categories}
			allowDeselect={allowDeselect === undefined ? true : allowDeselect}
		/>
	);
}
