import { usePDF } from "@react-pdf/renderer";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FinalsButton from "@/components/FinalsButton/components/FinalsButton";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useContestContext } from "@/context/contest/ContestContext";
import { usePrintSettings } from "@/context/printSettings/PrintSettingsContext";
import { getContestName } from "@/i18n/contestNames";
import { pdfT, usePdfLang } from "@/i18n/pdfLang";
import type { Contest } from "@/types/Contestant";
import { TypeOfContest } from "@/utils/contestUtils";
import { BySubcategory } from "@/utils/filterUtils";
import type { FormData } from "./../../../components/FinalsButton/types/FinalsForm.types";
import AllCategoriesDocument from "./components/AllCategoriesDocument";
import PrintDocument from "./components/PrintDocument";
import { getAdditionalHeaders, getCompetitionScoreSorter } from "./utils";

export type ResultRow = {
	number: string;
	name: string;
	club: string;
	nation?: string;
	category: string;
	contestData: Contest;
};

export default function ContestResults() {
	const { compInfo, contestants, subcategory: subcategoryId } = useCompetitionContext();
	const subcategory = compInfo.subcategories?.find((x) => x.id === subcategoryId);
	const fileSuffix = subcategory ? `-${subcategory.name}` : "";
	const { contestId } = useContestContext();
	const { category, currentContestants, setCategoryFilter } = useContestContext();
	const { showCreatorFooter } = usePrintSettings();
	const [pdfLang] = usePdfLang();

	const contestName = getContestName(contestId, pdfT);
	const mainJudgeLabel = pdfT("print.mainJudge");
	const secretaryLabel = pdfT("print.secretary");
	const providedByLabel = pdfT("print.providedBy");
	const contestLabel = pdfT("print.contest");

	// biome-ignore lint/correctness/useExhaustiveDependencies: Set category to all at start
	useEffect(() => { setCategoryFilter(undefined); }, []);
	const [finalCount, setFinalCount] = useState<number | undefined>(undefined);
	const [finalResults, setFinalResults] = useState<FormData | undefined>(undefined);

	const resultsId = useMemo(() => {
		// Subcategory is part of the key so each event keeps its own finals.
		return `${compInfo.id}-${contestId}-${category}${subcategoryId ? `-${subcategoryId}` : ""}`;
	}, [compInfo.id, contestId, category, subcategoryId]);

	const additionalColumns = useMemo(() => {
		return getAdditionalHeaders(TypeOfContest(contestId));
	}, [contestId, pdfLang]);

	const results = useMemo(() => {
		return currentContestants
			.filter(BySubcategory(subcategoryId))
			.map((x) => {
				const result = x.contests.find(
					(r) => r.id === Number(contestId) && r.takesPart,
				);

				return {
					category: x.category,
					club: x.club,
					nation: x.nation,
					name: x.name,
					number: x.number.toString(),
					contestData: result,
				} as ResultRow;
			})
			.sort(getCompetitionScoreSorter(TypeOfContest(contestId)));
	}, [currentContestants, contestId, subcategoryId]);

	const pdfProps = useMemo(() => ({ contestName, contestLabel, mainJudgeLabel, secretaryLabel, providedByLabel, subcategory }), [contestName, contestLabel, mainJudgeLabel, secretaryLabel, providedByLabel, subcategory]);

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
				printName={category ? `Konkurencja-${contestId}-${category}${fileSuffix}.pdf` : `Konkurencja-${contestId}-wszystkie${fileSuffix}.pdf`}
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
