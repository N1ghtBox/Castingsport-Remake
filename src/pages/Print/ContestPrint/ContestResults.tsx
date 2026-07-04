import { usePDF } from "@react-pdf/renderer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import FinalsButton from "@/components/FinalsButton/components/FinalsButton";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useContestContext } from "@/context/contest/ContestContext";
import { usePrintSettings } from "@/context/printSettings/PrintSettingsContext";
import { useContestName } from "@/i18n/contestNames";
import type { Contest } from "@/types/Contestant";
import { TypeOfContest } from "@/utils/contestUtils";
import type { FormData } from "./../../../components/FinalsButton/types/FinalsForm.types";
import AllCategoriesDocument from "./components/AllCategoriesDocument";
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
	const { compInfo, contestants } = useCompetitionContext();
	const { contestId } = useContestContext();
	const { category, currentContestants, setCategoryFilter } = useContestContext();
	const { showCreatorFooter } = usePrintSettings();
	const { t } = useTranslation();
	const getContestName = useContestName();

	const contestName = getContestName(contestId);
	const mainJudgeLabel = t("print.mainJudge");
	const secretaryLabel = t("print.secretary");
	const providedByLabel = t("print.providedBy");
	const contestLabel = t("print.contest");

	// biome-ignore lint/correctness/useExhaustiveDependencies: Set category to all at start
	useEffect(() => { setCategoryFilter(undefined); }, []);
	const [finalCount, setFinalCount] = useState<number | undefined>(undefined);
	const [finalResults, setFinalResults] = useState<FormData | undefined>(undefined);

	const resultsId = useMemo(() => {
		return `${compInfo.id}-${contestId}-${category}`;
	}, [compInfo.id, contestId, category]);

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
			.sort(getCompetitionScoreSorter(TypeOfContest(contestId)));
	}, [currentContestants, contestId]);

	const pdfProps = useMemo(() => ({ contestName, contestLabel, mainJudgeLabel, secretaryLabel, providedByLabel }), [contestName, contestLabel, mainJudgeLabel, secretaryLabel, providedByLabel]);

	const singleMounted = useRef(false);
	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				count={finalCount}
				comp={compInfo}
				category={category || "--"}
				contestId={contestId}
				results={results}
				additionalColumns={{ ...additionalColumns }}
				finalResults={finalResults}
				showCreatorFooter={showCreatorFooter}
				{...pdfProps}
			/>
		),
	});

	React.useEffect(() => {
		if (!singleMounted.current) { singleMounted.current = true; return; }
		if (!category) return;
		updateInstance(
			<PrintDocument
				comp={compInfo}
				category={category || "--"}
				contestId={contestId}
				results={results}
				count={finalCount}
				additionalColumns={{ ...additionalColumns }}
				finalResults={finalResults}
				showCreatorFooter={showCreatorFooter}
				{...pdfProps}
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
		showCreatorFooter,
		pdfProps
	]);

	const allMounted = useRef(false);
	const [allInstance, updateAllInstance] = usePDF({
		document: (
			<AllCategoriesDocument
				comp={compInfo}
				contestId={contestId}
				contestants={contestants}
				showCreatorFooter={showCreatorFooter}
				{...pdfProps}
			/>
		),
	});

	React.useEffect(() => {
		if (!allMounted.current) { allMounted.current = true; return; }
		if (category) return;
		updateAllInstance(
			<AllCategoriesDocument
				comp={compInfo}
				contestId={contestId}
				contestants={contestants}
				showCreatorFooter={showCreatorFooter}
				{...pdfProps}
			/>,
		);
	}, [compInfo, contestId, contestants, updateAllInstance, showCreatorFooter, category, pdfProps]);

	return (
		<>
			<PrintActionButtons
				instance={category ? instance : allInstance}
				printName={category ? `Konkurencja-${contestId}-${category}.pdf` : `Konkurencja-${contestId}-wszystkie.pdf`}
				hasCategoryCombobox
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

			<PrintDisplay instance={category ? instance : allInstance} />
		</>
	);
}
