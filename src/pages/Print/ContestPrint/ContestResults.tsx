import { usePDF } from "@react-pdf/renderer";
import React, { useMemo, useState } from "react";
import FinalsButton from "@/components/FinalsButton/components/FinalsButton";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useContestContext } from "@/context/contest/ContestContext";
import type { Contest } from "@/types/Contestant";
import { TypeOfContest } from "@/utils/contestUtils";
import type { FormData } from "./../../../components/FinalsButton/types/FinalsForm.types";
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
	const { compInfo } = useCompetitionContext();
	const { contestId } = useContestContext();
	const { category, currentContestants } = useContestContext();
	const [finalCount, setFinalCount] = useState<number | undefined>(undefined);
	const [finalResults, setFinalResults] = useState<FormData | undefined>(
		undefined,
	);

	const resultsId = useMemo(() => {
		return `${compInfo.id}-${contestId}-${category}`;
	}, [compInfo.id, contestId, category]);

	const sorter = useMemo(() => {
		return getCompetitionScoreSorter(TypeOfContest(contestId));
	}, [contestId]);

	const additionalColumns = useMemo(() => {
		return getAdditionalHeaders(TypeOfContest(contestId));
	}, [contestId]);

	const results = useMemo(() => {
		return currentContestants
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
	}, [currentContestants, contestId, sorter]);

	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				count={finalCount}
				comp={compInfo}
				category={category || "--"}
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
				comp={compInfo}
				category={category || "--"}
				contestId={contestId}
				results={results}
				count={finalCount}
				additionalColumns={{ ...additionalColumns }}
				finalResults={finalResults}
			/>,
		);
	}, [
		compInfo,
		category,
		contestId,
		additionalColumns,
		results,
		updateInstance,
		finalCount,
		finalResults,
	]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={`Konkurencja-${contestId}-${category}.pdf`}
				additionalActions={
					<FinalsButton
						id={resultsId}
						results={results}
						callback={(count, data) => {
							setFinalCount(count);
							setFinalResults(data);
						}}
					/>
				}
			/>

			<PrintDisplay instance={instance} />
		</>
	);
}
