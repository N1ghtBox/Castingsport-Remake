import { usePDF } from "@react-pdf/renderer";
import { useEffect, useMemo } from "react";
import { useLoaderData } from "react-router";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useContestContext } from "@/context/contest/ContestContext";
import type { Contestant } from "@/types/Contestant";
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
	const { currentContestants, category } = useContestContext();
	const competitionContext = useCompetitionContext();

	const results: ContestantWithThlonResult[] = useMemo(() => {
		return currentContestants as ContestantWithThlonResult[];
	}, [currentContestants]);

	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				comp={competitionContext.compInfo}
				category={category || "--"}
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
				category={category || "--"}
				from={from}
				to={to}
				results={results}
			/>,
		);
	}, [
		competitionContext.compInfo,
		category,
		from,
		to,
		results,
		updateInstance,
	]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={`${getThlonName(from, to)}-${category}.pdf`}
			/>
			<PrintDisplay instance={instance} />
		</>
	);
}
