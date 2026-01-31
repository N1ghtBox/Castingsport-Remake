import { Document, Page, Text, usePDF, View } from "@react-pdf/renderer";
import React, { useEffect, useId, useMemo } from "react";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import PdfConsts from "@/consts/PdfConsts";
import SeriePrintHeader from "@/pages/SeriePrintHeader";
import { SerieContext } from "@/types/SerieContext";
import type { Series } from "@/types/Series";
import type { SummedSerieTeam } from "@/utils/seriesUtils";
import ResultTable from "./components/ResultTable";

export default function SerieTeamResults() {
	const { serie, teamCategory, teamResults } = React.useContext(SerieContext);
	const id = useId();

	const results: SummedSerieTeam[] = useMemo(() => {
		return teamResults
			.filter((x) => {
				return x.category === teamCategory;
			})
			.map((con, i) => ({
				...con,
				compPlacements: con.placements.sort((a, b) =>
					a.compName.localeCompare(b.compName, undefined, {}),
				),
				seriePlace: i + 1,
			}));
	}, [teamResults, teamCategory]);

	const headers = useMemo(() => {
		if (!results[0]) return [];

		return results[0].placements
			.sort((a, b) => a.compName.localeCompare(b.compName))
			.map((placements) => (
				<View
					style={[PdfConsts.styles.doubleColumnHeader_View, { width: "15%" }]}
					key={`${id}`}>
					<Text>{placements.compName}</Text>
					<View style={{ display: "flex", flexDirection: "row" }}>
						<Text style={PdfConsts.styles.doubleColumnHeader_Text}>
							Miejsce
						</Text>
						<Text style={PdfConsts.styles.doubleColumnHeader_Text}>Wynik</Text>
					</View>
				</View>
			));
	}, [results, id]);

	const [instance, updateInstance] = usePDF({
		document: (
			<ResultDocument
				headers={headers}
				serie={serie}
				category={teamCategory}
				results={results}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<ResultDocument
				headers={headers}
				serie={serie}
				category={teamCategory}
				results={results}
			/>,
		);
	}, [serie, updateInstance, teamCategory, results, headers]);

	return (
		<>
			<PrintActionButtons
				instance={instance}
				printName={`${serie.name}-${teamCategory}.pdf`}
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
}: {
	serie: Series;
	category: string;
	results: SummedSerieTeam[];
	headers: JSX.Element[];
}) {
	return (
		<Document
			title={PdfConsts.title}
			creator={PdfConsts.creator}>
			<Page
				size="A4"
				style={PdfConsts.styles.page}>
				<SeriePrintHeader serie={serie} />
				<View style={PdfConsts.styles.titleWrapper}>
					<View style={PdfConsts.styles.titleCategory}>
						<Text>{category}</Text>
					</View>
					<View style={PdfConsts.styles.titleEventWrapper}>
						<Text style={PdfConsts.styles.titleEventTop}>Konkurencje 1-5</Text>
						<Text style={PdfConsts.styles.titleEventBottom}>5-bój</Text>
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
