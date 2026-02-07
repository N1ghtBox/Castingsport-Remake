import { usePDF } from "@react-pdf/renderer";
import React, { useEffect, useMemo } from "react";
import { useLoaderData } from "react-router";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import type { Contestant } from "@/types/Contestant";
import { ContestContext } from "@/types/ContestContext";
import { getThlonName } from "@/utils/contestUtils";
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

export default function ThlonResults() {
	const { from, to } = useLoaderData() as {
		from: number;
		to: number;
	};
	const contest = React.useContext(ContestContext);
	const competitionContext = useCompetitionContext();

	const results: ContestantWithThlonResult[] = useMemo(() => {
		return contest.currentContestants as ContestantWithThlonResult[];
	}, [contest.currentContestants]);

	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				comp={competitionContext.compInfo}
				category={contest.category || "--"}
				from={from}
				to={to}
				results={results}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<PrintDocument
				comp={competitionContext.compInfo}
				category={contest.category || "--"}
				from={from}
				to={to}
				results={results}
			/>,
		);
	}, [
		competitionContext.compInfo,
		contest.category,
		from,
		to,
		results,
		updateInstance,
	]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={`${getThlonName(from, to)}-${contest.category}.pdf`}
			/>
			<PrintDisplay instance={instance} />
		</>
	);
}
