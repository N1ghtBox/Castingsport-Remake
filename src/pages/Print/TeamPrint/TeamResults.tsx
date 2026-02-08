import { usePDF } from "@react-pdf/renderer";
import { useEffect } from "react";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useTeamContext } from "@/context/team/TeamContext";
import type { Contestant } from "@/types/Contestant";
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
	const { compInfo } = useCompetitionContext();
	const { teamResults, category } = useTeamContext();

	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				comp={compInfo}
				category={category}
				results={teamResults}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<PrintDocument
				comp={compInfo}
				category={category}
				results={teamResults}
			/>,
		);
	}, [compInfo, updateInstance, teamResults, category]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={`Drużyny-${category}.pdf`}
				teams
			/>

			<PrintDisplay instance={instance} />
		</>
	);
}
