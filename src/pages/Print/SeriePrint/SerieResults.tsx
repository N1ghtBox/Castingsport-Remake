import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import SeriePrintHeader from "@/components/SeriePrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import { useSerieContext } from "@/context/serie/SerieContext";
import type { SerieContestantResult, Series } from "@/types/Series";
import { getThlonEnumName, getThlonName } from "@/utils/contestUtils";
import { AddSeriePlace } from "@/utils/convertUtils";
import { ByContestantCategoryInThlon } from "@/utils/filterUtils";
import { sortByCompetitionName } from "@/utils/sortUtils";
import { Document, Page, Text, usePDF, View } from "@react-pdf/renderer";
import { useEffect, useMemo } from "react";
import { useLoaderData } from "react-router";
import ResultTable from "./components/ResultTable";

export default function SerieResults() {
	const { serie, category, serieResults } = useSerieContext();
	const { from, to } = useLoaderData();

	const results: SerieContestantResult[] = useMemo(() => {
		const thlonName = getThlonEnumName(from, to);

		return serieResults[thlonName]
			.filter(ByContestantCategoryInThlon(category, { from, to }))
			.map(AddSeriePlace)
	}, [serieResults, category, from, to]);

	const headers = useMemo(() => {
		if (!results[0]) return [];

		return results[0].placements
			.sort(sortByCompetitionName)
			.map((placements) => (
				<View
					key={placements.competitionName}
					style={[
						PdfConsts.styles.doubleColumnHeader_View,
						{ width: "15%", textAlign: "center" },
					]}>
					<Text>{placements.competitionName}</Text>
					<View style={{ display: "flex", flexDirection: "row" }}>
						<Text style={PdfConsts.styles.doubleColumnHeader_Text}>
							Miejsce
						</Text>
						<Text style={PdfConsts.styles.doubleColumnHeader_Text}>Wynik</Text>
					</View>
				</View>
			));
	}, [results]);

	const [instance, updateInstance] = usePDF({
		document: (
			<ResultDocument
				headers={headers}
				serie={serie}
				category={category}
				results={results}
				from={from}
				to={to}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<ResultDocument
				headers={headers}
				serie={serie}
				category={category}
				from={from}
				to={to}
				results={results}
			/>,
		);
	}, [serie, updateInstance, category, results, headers, from, to]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={`${serie.name}-${category}.pdf`}
			/>
			<PrintDisplay instance={instance} />
		</>
	);
}

function ResultDocument({
	serie,
	category,
	results,
	headers,
	from,
	to,
}: {
	serie: Series;
	category: string;
	results: SerieContestantResult[];
	headers: JSX.Element[];
	from: number;
	to: number;
}) {
	return (
		<Document
			title={PdfConsts.title}
			creator={PdfConsts.creator}>
			<Page
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
							Konkurencje {from}-{to}
						</Text>
						<Text style={PdfConsts.styles.titleEventBottom}>
							{getThlonName(from, to)}
						</Text>
					</View>
				</View>
				<ResultTable
					data={results}
					headers={headers}
				/>
			</Page>
		</Document>
	);
}
