import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useThlonContext } from "@/context/thlon/ThlonContext";
import { Categories, type CategoryValues, Contests } from "@/types/Contestant";
import { Combobox } from "../Combobox";

export default function ThlonCategoryCombobox({
	allowDeselect,
	placeholder,
}: {
	allowDeselect?: boolean;
	placeholder?: string;
}) {
	const { thlon: { from, to }, setCategoryFilter, category } = useThlonContext();
	const { t } = useTranslation();

	const options = useMemo(() => [
		{ label: t("category.kadets"), value: Categories.Kadet },
		{ label: t("category.juniors"), value: Categories.Junior },
		{ label: t("category.juniorkas"), value: Categories.Juniorka },
		{ label: t("category.men"), value: Categories.Man },
		{ label: t("category.women"), value: Categories.Kobieta },
	], [t]);

	const updateCategory = useCallback(
		(value: string | undefined) => {
			setCategoryFilter(value as CategoryValues | undefined);
		},
		[setCategoryFilter],
	);

	const categories = useMemo(() => {
		if (from < Contests.Arenberg && to <= Contests.Distance) {
			const returnOptions = options.filter((x) => x.value !== Categories.Kadet);
			if (category !== undefined && !returnOptions.some((x) => x.value === category))
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
			if (category !== undefined && !returnOptions.some((x) => x.value === category))
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
			if (category !== undefined && !returnOptions.some((x) => x.value === category))
				updateCategory(Categories.Man);

			return returnOptions;
		}

		return options;
	}, [from, to, category, updateCategory, options]);

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
