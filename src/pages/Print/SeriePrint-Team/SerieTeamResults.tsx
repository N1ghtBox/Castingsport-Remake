import { Document, Page, Text, usePDF, View } from "@react-pdf/renderer";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import SeriePrintHeader from "@/components/SeriePrintHeader";
import SerieTeamCategoryCombobox from "@/components/SerieTeamCategoryCombobox";
import PdfConsts from "@/consts/PdfConsts";
import { useSerieContext } from "@/context/serie/SerieContext";
import { pdfT, usePdfLang } from "@/i18n/pdfLang";
import { Categories } from "@/types/Contestant";
import type { Series, SerieTeamResult } from "@/types/Series";
import { TeamCategory, type TeamCategoryValues } from "@/types/Teams";
import ResultTable from "./components/ResultTable";

type CategoryPage = {
	category: TeamCategoryValues;
	results: SerieTeamResult[];
};

export default function SerieTeamResults() {
	const { serie, teamCategory, setTeamCategory, teamResults } =
		useSerieContext();
	const { t } = useTranslation();
	const [pdfLang] = usePdfLang();

	const isAll = (teamCategory as string) === Categories.Unknown;

	// "All categories" is print-only, so restore the results page category when leaving it selected
	const categoryRef = useRef(teamCategory);
	categoryRef.current = teamCategory;
	// biome-ignore lint/correctness/useExhaustiveDependencies: Run only on mount/unmount
	useEffect(() => {
		const initialCategory = teamCategory;
		return () => {
			if ((categoryRef.current as string) === Categories.Unknown)
				setTeamCategory(initialCategory);
		};
	}, []);

	const pages: CategoryPage[] = useMemo(() => {
		const categories = isAll ? Object.values(TeamCategory) : [teamCategory];

		return categories
			.map((category) => ({
				category,
				results: teamResults
					.filter((x) => x.category === category)
					.map((con, i) => ({
						...con,
						compPlacements: con.placements.sort((a, b) =>
							a.competitionName.localeCompare(b.competitionName, undefined, {}),
						),
						seriePlace: i + 1,
					})),
			}))
			.filter((page) => !isAll || page.results.length > 0);
	}, [teamResults, teamCategory, isAll]);

	const [instance, updateInstance] = usePDF({
		document: (
			<ResultDocument
				serie={serie}
				pages={pages}
			/>
		),
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: pdfLang re-renders translated headers
	useEffect(() => {
		updateInstance(
			<ResultDocument
				serie={serie}
				pages={pages}
			/>,
		);
	}, [serie, updateInstance, pages, pdfLang]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={`${serie.name}-${isAll ? "wszystkie" : teamCategory}.pdf`}
				categoryCombobox={
					<SerieTeamCategoryCombobox
						allowDeselect
						placeholder={t("common.allCategories")}
					/>
				}
			/>
			<PrintDisplay instance={instance} />
		</>
	);
}

function getResultHeaders(results: SerieTeamResult[]) {
	if (!results[0]) return [];

	return results[0].placements
		.sort((a, b) => a.competitionName.localeCompare(b.competitionName))
		.map((placements) => (
			<View
				style={[PdfConsts.styles.doubleColumnHeader_View, { width: "15%" }]}
				key={placements.competitionName}>
				<Text>{placements.competitionName}</Text>
				<View style={{ display: "flex", flexDirection: "row" }}>
					<Text style={PdfConsts.styles.doubleColumnHeader_Text}>
						{pdfT("table.place")}
					</Text>
					<Text style={PdfConsts.styles.doubleColumnHeader_Text}>
						{pdfT("table.score")}
					</Text>
				</View>
			</View>
		));
}

function ResultDocument({
	serie,
	pages,
}: {
	serie: Series;
	pages: CategoryPage[];
}) {
	return (
		<Document
			title={PdfConsts.title}
			creator={PdfConsts.creator}>
			{pages.map(({ category, results }) => (
				<Page
					key={category}
					size="A4"
					style={PdfConsts.styles.page}>
					<SeriePrintHeader serie={serie} />
					<View style={PdfConsts.styles.titleWrapper}>
						<View style={PdfConsts.styles.titleCategory}>
							<Text>Drużyna - {category}</Text>
						</View>
						<View style={PdfConsts.styles.titleEventWrapper}>
							<Text style={PdfConsts.styles.titleEventTop}>
								{pdfT("nav.contests")} 1-5
							</Text>
							<Text style={PdfConsts.styles.titleEventBottom}>
								{pdfT("thlon.n", { n: 5 })}
							</Text>
						</View>
					</View>
					<ResultTable
						data={results}
						headers={getResultHeaders(results)}
					/>
				</Page>
			))}
		</Document>
	);
}
