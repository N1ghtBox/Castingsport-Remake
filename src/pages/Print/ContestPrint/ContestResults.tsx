import { usePDF } from "@react-pdf/renderer";
import React, { useMemo } from "react";
import { useLoaderData } from "react-router";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import useFinalsButton from "@/hooks/use-finals-button";
import { CompetitonContext } from "@/types/CompetitionContext";
import type { Contest } from "@/types/Contestant";
import { ContestContext } from "@/types/ContestContext";
import { TypeOfContest } from "@/utils/contestUtils";
import PrintDocument from "./components/PrintDocument";
import { getAdditionalHeaders, getCompetitionScoreSorter } from "./utils";

export type ResultRow = {
	number: string;
	name: string;
	club: string;
	category: string;
	contestData: Contest;
};

export default function ContestResults() {
	const contestId = useLoaderData();
	const competitionContext = React.useContext(CompetitonContext);
	const constestContext = React.useContext(ContestContext);
	const resultsId = `${competitionContext.compInfo.id}-${contestId}-${constestContext.category}`;

	const sorter = useMemo(() => {
		const contestIdInt = Number.parseInt(contestId);

		return getCompetitionScoreSorter(TypeOfContest(contestIdInt));
	}, [contestId]);

	const additionalColumns = useMemo(() => {
		const contestIdInt = Number.parseInt(contestId);

		return getAdditionalHeaders(TypeOfContest(contestIdInt));
	}, [contestId]);

	const results = useMemo(() => {
		return constestContext.currentContestants
			.map((x) => {
				const result = x.contests.find(
					(r) => r.id === Number(contestId) && r.takesPart,
				);

				return {
					category: x.category,
					club: x.club,
					name: x.name,
					number: x.number.toString(),
					contestData: result,
				} as ResultRow;
			})
			.sort(sorter);
	}, [constestContext.currentContestants, contestId, sorter]);

	const { finalResults, count, FinalsButton } = useFinalsButton(
		resultsId,
		results,
	);

	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				count={count}
				comp={competitionContext.compInfo}
				category={constestContext.category || "--"}
				contestId={contestId}
				results={results.sort(sorter)}
				additionalColumns={{ ...additionalColumns }}
				finalResults={finalResults}
			/>
		),
	});

	React.useEffect(() => {
		updateInstance(
			<PrintDocument
				comp={competitionContext.compInfo}
				category={constestContext.category || "--"}
				contestId={contestId}
				results={results}
				count={count}
				additionalColumns={{ ...additionalColumns }}
				finalResults={finalResults}
			/>,
		);
	}, [
		competitionContext.compInfo,
		constestContext.category,
		contestId,
		additionalColumns,
		results,
		updateInstance,
		count,
		finalResults,
	]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={`Konkurencja-${contestId}-${constestContext.category}.pdf`}
				additionalActions={<FinalsButton />}
			/>

			<PrintDisplay instance={instance} />
		</>
	);
}
