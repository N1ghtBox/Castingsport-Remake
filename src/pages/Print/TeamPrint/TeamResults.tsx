import { usePDF } from "@react-pdf/renderer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { usePrintSettings } from "@/context/printSettings/PrintSettingsContext";
import { useTeamContext } from "@/context/team/TeamContext";
import type { Contestant } from "@/types/Contestant";
import AllCategoriesTeamDocument from "./components/AllCategoriesDocument";
import PrintDocument from "./components/PrintDocument";

export type ResultRow = {
	number: string;
	name: string;
	club: string;
	category: string;
};

export type ContestantWithThlonResult = Contestant & {
	place: number;
	total: number;
};

export default function TeamResults() {
	const { compInfo, teams, contestants } = useCompetitionContext();
	const { teamResults, category } = useTeamContext();
	const { showCreatorFooter } = usePrintSettings();
	const { t } = useTranslation();

	const mainJudgeLabel = t("print.mainJudge");
	const secretaryLabel = t("print.secretary");
	const providedByLabel = t("print.providedBy");
	const footerProps = { mainJudgeLabel, secretaryLabel, providedByLabel };

	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				comp={compInfo}
				category={category}
				results={teamResults}
				showCreatorFooter={showCreatorFooter}
				{...footerProps}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<PrintDocument
				comp={compInfo}
				category={category}
				results={teamResults}
				showCreatorFooter={showCreatorFooter}
				{...footerProps}
			/>,
		);
	}, [compInfo, updateInstance, teamResults, category, showCreatorFooter, mainJudgeLabel, secretaryLabel, providedByLabel]);

	const [allInstance, updateAllInstance] = usePDF({
		document: (
			<AllCategoriesTeamDocument comp={compInfo} teams={teams} contestants={contestants} showCreatorFooter={showCreatorFooter} {...footerProps} />
		),
	});

	useEffect(() => {
		updateAllInstance(
			<AllCategoriesTeamDocument comp={compInfo} teams={teams} contestants={contestants} showCreatorFooter={showCreatorFooter} {...footerProps} />,
		);
	}, [compInfo, teams, contestants, updateAllInstance, showCreatorFooter, mainJudgeLabel, secretaryLabel, providedByLabel]);

	return (
		<>
			<PrintActionButtons
				instance={category ? instance : allInstance}
				printName={category ? `Drużyny-${category}.pdf` : `Drużyny-wszystkie.pdf`}
				teams
			/>

			<PrintDisplay instance={category ? instance : allInstance} />
		</>
	);
}
