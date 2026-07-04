import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTeamContext } from "@/context/team/TeamContext";
import type { Team } from "@/types/Teams";
import { TeamCategory } from "@/types/Teams";
import { Combobox } from "../Combobox";

export default function TeamCategoryCombobox({ placeholder }: { placeholder?: string }) {
	const { setCategory, category } = useTeamContext();
	const { t } = useTranslation();

	const options = useMemo(() => [
		{ label: t("teamCategory.Młodzieży"), value: TeamCategory.Junior },
		{ label: t("teamCategory.Seniorów"), value: TeamCategory.Senior },
		{ label: t("teamCategory.Kobiet"), value: TeamCategory.Women },
	], [t]);

	const updateCategory = useCallback(
		(value: string | undefined) => {
			setCategory(value as Team["category"]);
		},
		[setCategory],
	);

	return (
		<Combobox
			onChange={updateCategory}
			value={category}
			options={options}
			allowDeselect
			placeholder={placeholder}
		/>
	);
}
