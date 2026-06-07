import { usePDF } from "@react-pdf/renderer";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { usePrintSettings } from "@/context/printSettings/PrintSettingsContext";
import { useThlonContext } from "@/context/thlon/ThlonContext";
import type { Contestant } from "@/types/Contestant";
import { getThlonName } from "@/utils/contestUtils";
import AllCategoriesDocument from "./components/AllCategoriesDocument";
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
	const {
		results,
		category,
		setCategoryFilter,
		thlon: { from, to },
	} = useThlonContext();
	const { compInfo, contestants } = useCompetitionContext();
	const { showCreatorFooter } = usePrintSettings();
	const { t } = useTranslation();

	const mainJudgeLabel = t("print.mainJudge");
	const secretaryLabel = t("print.secretary");
	const providedByLabel = t("print.providedBy");
	const thlonName = getThlonName(from, to);
	const contestsLabel = t("nav.contests");
	const footerProps = useMemo(() => ({ mainJudgeLabel, secretaryLabel, providedByLabel, thlonName, contestsLabel }), [mainJudgeLabel, secretaryLabel, providedByLabel, thlonName, contestsLabel]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Set category to all at start
	useEffect(() => { setCategoryFilter(undefined); }, []);

	const singleMounted = useRef(false);
	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				comp={compInfo}
				category={category || "--"}
				from={from}
				to={to}
				results={results}
				showCreatorFooter={showCreatorFooter}
				{...footerProps}
			/>
		),
	});

	useEffect(() => {
		if (!singleMounted.current) { singleMounted.current = true; return; }
		if (!category) return;
		updateInstance(
			<PrintDocument
				comp={compInfo}
				category={category || "--"}
				from={from}
				to={to}
				results={results}
				showCreatorFooter={showCreatorFooter}
				{...footerProps}
			/>,
		);
	}, [compInfo, category, from, to, results, updateInstance, showCreatorFooter, footerProps]);

	const allMounted = useRef(false);
	const [allInstance, updateAllInstance] = usePDF({
		document: (
			<AllCategoriesDocument comp={compInfo} from={from} to={to} contestants={contestants} showCreatorFooter={showCreatorFooter} {...footerProps} />
		),
	});

	useEffect(() => {
		if (!allMounted.current) { allMounted.current = true; return; }
		if (category) return;
		updateAllInstance(
			<AllCategoriesDocument comp={compInfo} from={from} to={to} contestants={contestants} showCreatorFooter={showCreatorFooter} {...footerProps} />,
		);
	}, [compInfo, from, to, contestants, updateAllInstance, showCreatorFooter, category, footerProps]);

	return (
		<>
			<PrintActionButtons
				instance={category ? instance : allInstance}
				hasCategoryCombobox
				thlons
				printName={category ? `${getThlonName(from, to)}-${category}.pdf` : `${getThlonName(from, to)}-wszystkie.pdf`}
			/>
			<PrintDisplay instance={category ? instance : allInstance} />
		</>
	);
}
