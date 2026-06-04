import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router";
import { Combobox } from "@/components/Combobox";
import { useSerieContext } from "@/context/serie/SerieContext";
import { Categories } from "@/types/Contestant";
import { getThlonEnumName } from "@/utils/contestUtils";

export default function SerieCategoryCombobox() {
	const { setCategory, category } = useSerieContext();
	const { from, to } = useLoaderData();
	const { t } = useTranslation();

	const options = useMemo(() => [
		{ label: t("category.juniors"), value: Categories.Junior },
		{ label: t("category.juniorkas"), value: Categories.Juniorka },
		{ label: t("category.men"), value: Categories.Man },
		{ label: t("category.women"), value: Categories.Kobieta },
	], [t]);

	const filteredOptions = useMemo(() => {
		const thlonName = getThlonEnumName(from, to);
		if (
			thlonName !== "distance" &&
			thlonName !== "multi" &&
			thlonName !== "9boj"
		)
			return options;

		return options.slice(2);
	}, [from, to, options]);

	return (
		<Combobox
			onChange={(val) => setCategory(val || Categories.Unknown)}
			value={category}
			options={filteredOptions}
		/>
	);
}
