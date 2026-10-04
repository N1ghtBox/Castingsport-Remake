import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { Combobox } from "../Combobox";

/**
 * Picks which event of a dual competition to rank and print for.
 * Renders nothing for competitions without subcategories, so call sites need no condition.
 */
export default function SubcategoryCombobox({
	placeholder,
}: {
	placeholder?: string;
}) {
	const { compInfo, subcategory, setSubcategory } = useCompetitionContext();
	const { t } = useTranslation();

	const options = useMemo(
		() =>
			(compInfo.subcategories ?? []).map((x) => ({
				label: x.name,
				value: x.id,
			})),
		[compInfo.subcategories],
	);

	const updateSubcategory = useCallback(
		(value: string | undefined) => setSubcategory(value),
		[setSubcategory],
	);

	if (!options.length) return null;

	return (
		<Combobox
			onChange={updateSubcategory}
			value={subcategory}
			options={options}
			allowDeselect
			placeholder={placeholder ?? t("subcategory.all")}
		/>
	);
}
