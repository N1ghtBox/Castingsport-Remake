import { usePDF } from "@react-pdf/renderer";
import { useEffect } from "react";
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
	const { teamResults, category, setCategory } = useTeamContext();
	const { showCreatorFooter } = usePrintSettings();

	useEffect(() => { setCategory(undefined); }, []);

	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				comp={compInfo}
				category={category}
				results={teamResults}
				showCreatorFooter={showCreatorFooter}
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
			/>,
		);
	}, [compInfo, updateInstance, teamResults, category, showCreatorFooter]);

	const [allInstance, updateAllInstance] = usePDF({
		document: (
			<AllCategoriesTeamDocument comp={compInfo} teams={teams} contestants={contestants} showCreatorFooter={showCreatorFooter} />
		),
	});

	useEffect(() => {
		updateAllInstance(
			<AllCategoriesTeamDocument comp={compInfo} teams={teams} contestants={contestants} showCreatorFooter={showCreatorFooter} />,
		);
	}, [compInfo, teams, contestants, updateAllInstance, showCreatorFooter]);

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
