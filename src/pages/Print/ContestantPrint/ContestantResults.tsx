import { usePDF } from "@react-pdf/renderer";
import { useEffect, useMemo } from "react";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { usePrintSettings } from "@/context/printSettings/PrintSettingsContext";
import { pdfT, usePdfLang } from "@/i18n/pdfLang";
import { sortByClubFirstNumber } from "@/utils/sortUtils";
import PrintDocument from "./components/PrintDocument";

export default function ContestantResults() {
	const { compInfo, contestants } = useCompetitionContext();
	const { showCreatorFooter } = usePrintSettings();
	const [pdfLang] = usePdfLang();

	const mainJudgeLabel = pdfT("print.mainJudge");
	const secretaryLabel = pdfT("print.secretary");
	const providedByLabel = pdfT("print.providedBy");
	const footerProps = useMemo(() => ({ mainJudgeLabel, secretaryLabel, providedByLabel }), [mainJudgeLabel, secretaryLabel, providedByLabel, pdfLang]);

	const sortedContestants = useMemo(() => sortByClubFirstNumber(contestants), [contestants]);

	const [instance, updateInstance] = usePDF({
		document: (
			<PrintDocument
				comp={compInfo}
				contestants={sortedContestants}
				showCreatorFooter={showCreatorFooter}
				{...footerProps}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<PrintDocument
				comp={compInfo}
				contestants={sortedContestants}
				showCreatorFooter={showCreatorFooter}
				{...footerProps}
			/>,
		);
	}, [compInfo, updateInstance, sortedContestants, showCreatorFooter, footerProps]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName="Zawodnicy.pdf"
			/>

			<PrintDisplay instance={instance} />
		</>
	);
}
