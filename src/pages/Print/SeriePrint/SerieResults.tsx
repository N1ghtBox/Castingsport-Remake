import { Document, Page, Text, usePDF, View } from "@react-pdf/renderer";
import React, { useEffect, useId, useMemo } from "react";
import { useLoaderData } from "react-router";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import PdfConsts from "@/consts/PdfConsts";
import SeriePrintHeader from "@/pages/SeriePrintHeader";
import { Categories } from "@/types/Contestant";
import { SerieContext } from "@/types/SerieContext";
import type { Series } from "@/types/Series";
import { getThlonEnumName, getThlonName } from "@/utils/contestUtils";
import type { SummedSerieContestant } from "@/utils/seriesUtils";
import ResultTable from "./components/ResultTable";

export default function SerieResults() {
	const { serie, category, serieResults } = React.useContext(SerieContext);
	const { from, to } = useLoaderData();
	const id = useId();

	const results: SummedSerieContestant[] = useMemo(() => {
		const thlonName = getThlonEnumName(from, to);

		return serieResults[thlonName]
			.filter((x) => {
				if (thlonName === "distance" || thlonName === "multi") {
					if (x.category === "Junior") return category === Categories.Man;
					if (x.category === "Juniorka") return category === "Kobieta";
				}
				return x.category === category;
			})
			.map((con, i) => ({
				...con,
				compPlacements: con.compPlacements.sort((a, b) =>
					a.compName.localeCompare(b.compName),
				),
				seriePlace: i + 1,
			}));
	}, [serieResults, category, from, to]);

	const headers = useMemo(() => {
		if (!results[0]) return [];

		return results[0].compPlacements
			.sort((a, b) => a.compName.localeCompare(b.compName))
			.map((placements) => (
				<View
					style={[
						PdfConsts.styles.doubleColumnHeader_View,
						{ width: "15%", textAlign: "center" },
					]}
					key={id}>
					<Text>{placements.compName}</Text>
					<View style={{ display: "flex", flexDirection: "row" }}>
						<Text style={PdfConsts.styles.doubleColumnHeader_Text}>Miejsce</Text>
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
	results: SummedSerieContestant[];
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
