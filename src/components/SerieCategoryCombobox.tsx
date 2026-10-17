import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router";
import { Combobox } from "@/components/Combobox";
import { useSerieContext } from "@/context/serie/SerieContext";
import { Categories } from "@/types/Contestant";
import { getSerieCategories } from "@/utils/seriesUtils";

const categoryLabelKeys = {
	[Categories.Junior]: "category.juniors",
	[Categories.Juniorka]: "category.juniorkas",
	[Categories.Man]: "category.men",
	[Categories.Kobieta]: "category.women",
} as const;

export default function SerieCategoryCombobox({
	allowDeselect,
	placeholder,
}: {
	allowDeselect?: boolean;
	placeholder?: string;
}) {
	const { setCategory, category } = useSerieContext();
	const { from, to } = useLoaderData();
	const { t } = useTranslation();

	const options = useMemo(
		() =>
			getSerieCategories(from, to).map((value) => ({
				label: t(categoryLabelKeys[value as keyof typeof categoryLabelKeys]),
				value,
			})),
		[from, to, t],
	);

	return (
		<Combobox
			onChange={(val) => setCategory(val || Categories.Unknown)}
			value={category === Categories.Unknown ? undefined : category}
			options={options}
			allowDeselect={allowDeselect}
			placeholder={placeholder}
		/>
	);
}
