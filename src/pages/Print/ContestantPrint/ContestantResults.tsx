import { usePDF } from "@react-pdf/renderer";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Combobox } from "@/components/Combobox";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { usePrintSettings } from "@/context/printSettings/PrintSettingsContext";
import { pdfT, usePdfLang } from "@/i18n/pdfLang";
import { type CategoryValues, ValidCategories } from "@/types/Contestant";
import { sortByClubFirstNumber } from "@/utils/sortUtils";
import PrintDocument from "./components/PrintDocument";

export default function ContestantResults() {
	const { compInfo, contestants } = useCompetitionContext();
	const { showCreatorFooter } = usePrintSettings();
	const [pdfLang] = usePdfLang();
	const { t } = useTranslation();
	const [category, setCategory] = useState<CategoryValues>();

	const mainJudgeLabel = pdfT("print.mainJudge");
	const secretaryLabel = pdfT("print.secretary");
	const providedByLabel = pdfT("print.providedBy");
	const footerProps = useMemo(
		() => ({ mainJudgeLabel, secretaryLabel, providedByLabel }),
		[mainJudgeLabel, secretaryLabel, providedByLabel, pdfLang],
	);

	const categoryOptions = useMemo(
		() =>
			ValidCategories.map((val) => ({
				value: val,
				label: t(`category.${val}` as any, val),
			})),
		[t],
	);

	const sortedContestants = useMemo(
		() =>
			sortByClubFirstNumber(
				contestants.filter((x) => !category || x.category === category),
			),
		[contestants, category],
	);

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
	}, [
		compInfo,
		updateInstance,
		sortedContestants,
		showCreatorFooter,
		footerProps,
	]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={category ? `Zawodnicy-${category}.pdf` : "Zawodnicy.pdf"}
				categoryCombobox={
					<Combobox
						onChange={(val) => setCategory(val as CategoryValues | undefined)}
						value={category}
						options={categoryOptions}
						allowDeselect
						placeholder={t("common.allCategories")}
					/>
				}
			/>

			<PrintDisplay instance={instance} />
		</>
	);
}
