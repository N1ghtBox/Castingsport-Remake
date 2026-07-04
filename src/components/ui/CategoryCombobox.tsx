import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useContestContext } from "@/context/contest/ContestContext";
import { Categories, type CategoryValues, Contests, ValidCategories } from "@/types/Contestant";
import { Combobox } from "../Combobox";

export default function CategoryCombobox({
	allowDeselect,
	placeholder,
}: {
	allowDeselect?: boolean;
	placeholder?: string;
}) {
	const { contestId, setCategoryFilter, category } = useContestContext();
	const { t } = useTranslation();

	const updateCategory = useCallback(
		(value: string | undefined) => {
			setCategoryFilter(value as CategoryValues | undefined);
		},
		[setCategoryFilter],
	);

	const allOptions = useMemo(
		() => ValidCategories.map((val) => ({ value: val, label: t(`category.${val}` as any, val) })),
		[t],
	);

	const categories = useMemo(() => {
		let returnOptions = allOptions;
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
	}, [contestId, category, updateCategory, allOptions]);

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
