import { Document, Page, Text, usePDF, View } from "@react-pdf/renderer";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import SerieCategoryCombobox from "@/components/SerieCategoryCombobox";
import SeriePrintHeader from "@/components/SeriePrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import { useSerieContext } from "@/context/serie/SerieContext";
import { pdfT, usePdfLang } from "@/i18n/pdfLang";
import { Categories, type CategoryValues } from "@/types/Contestant";
import type { SerieContestantResult, Series } from "@/types/Series";
import { getThlonEnumName, getThlonNameKey } from "@/utils/contestUtils";
import { AddSeriePlace } from "@/utils/convertUtils";
import { ByContestantCategoryInThlon } from "@/utils/filterUtils";
import { getSerieCategories } from "@/utils/seriesUtils";
import { sortByCompetitionName } from "@/utils/sortUtils";
import ResultTable from "./components/ResultTable";

type CategoryPage = {
	category: CategoryValues;
	results: SerieContestantResult[];
};

export default function SerieResults() {
	const { serie, category, setCategory, serieResults } = useSerieContext();
	const { from, to } = useLoaderData();
	const { t } = useTranslation();
	const [pdfLang] = usePdfLang();

	const isAll = category === Categories.Unknown;

	// "All categories" is print-only, so restore the results page category when leaving it selected
	const categoryRef = useRef(category);
	categoryRef.current = category;
	// biome-ignore lint/correctness/useExhaustiveDependencies: Run only on mount/unmount
	useEffect(() => {
		const initialCategory = category;
		return () => {
			if (categoryRef.current === Categories.Unknown)
				setCategory(initialCategory);
		};
	}, []);

	const pages: CategoryPage[] = useMemo(() => {
		const thlonName = getThlonEnumName(from, to);
		const categories = isAll ? getSerieCategories(from, to) : [category];

		return categories
			.map((cat) => ({
				category: cat,
				results: serieResults[thlonName]
					.filter(ByContestantCategoryInThlon(cat, { from, to }))
					.map(AddSeriePlace)
					.map((con) => ({
						...con,
						placements: [...con.placements].sort(sortByCompetitionName),
					})),
			}))
			.filter((page) => !isAll || page.results.length > 0);
	}, [serieResults, category, isAll, from, to]);

	const [instance, updateInstance] = usePDF({
		document: (
			<ResultDocument
				serie={serie}
				pages={pages}
				from={from}
				to={to}
			/>
		),
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: pdfLang re-renders translated headers
	useEffect(() => {
		updateInstance(
			<ResultDocument
				serie={serie}
				pages={pages}
				from={from}
				to={to}
			/>,
		);
	}, [serie, updateInstance, pages, from, to, pdfLang]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={`${serie.name}-${isAll ? "wszystkie" : category}.pdf`}
				categoryCombobox={
					<SerieCategoryCombobox
						allowDeselect
						placeholder={t("common.allCategories")}
					/>
				}
			/>
			<PrintDisplay instance={instance} />
		</>
	);
}

function getResultHeaders(results: SerieContestantResult[]) {
	if (!results[0]) return [];

	return results[0].placements.map((placements) => (
		<View
			key={placements.competitionName}
			style={[
				PdfConsts.styles.doubleColumnHeader_View,
				{ width: "15%", textAlign: "center" },
			]}>
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
	from,
	to,
}: {
	serie: Series;
	pages: CategoryPage[];
	from: number;
	to: number;
}) {
	return (
		<Document
			title={PdfConsts.title}
			creator={PdfConsts.creator}>
			{pages.map(({ category, results }) => (
				<Page
					key={category}
					size="A4"
					style={PdfConsts.styles.page}
					orientation="landscape">
					<SeriePrintHeader serie={serie} />
					<View style={PdfConsts.styles.titleWrapper}>
						<View style={PdfConsts.styles.titleCategory}>
							<Text>{category}</Text>
						</View>
						<View style={PdfConsts.styles.titleEventWrapper}>
							<Text style={PdfConsts.styles.titleEventTop}>
								{pdfT("nav.contests")} {from}-{to}
							</Text>
							<Text style={PdfConsts.styles.titleEventBottom}>
								{pdfT(getThlonNameKey(from, to), { n: to - from + 1 })}
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
