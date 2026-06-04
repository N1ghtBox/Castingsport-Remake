import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Combobox } from "@/components/Combobox";
import { useSerieContext } from "@/context/serie/SerieContext";
import { Categories } from "@/types/Contestant";
import { TeamCategory } from "@/types/Teams";

export default function SerieTeamCategoryCombobox() {
	const { setTeamCategory, teamCategory } = useSerieContext();
	const { t } = useTranslation();

	const options = useMemo(() => [
		{ label: t("teamCategory.Młodzieży"), value: TeamCategory.Junior },
		{ label: t("teamCategory.Seniorów"), value: TeamCategory.Senior },
		{ label: t("teamCategory.Kobiet"), value: TeamCategory.Women },
	], [t]);

	return (
		<Combobox
			onChange={(val) => setTeamCategory(val || Categories.Unknown)}
			value={teamCategory}
			options={options}
		/>
	);
}
