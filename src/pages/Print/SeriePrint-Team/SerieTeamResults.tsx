import { Print } from "@mui/icons-material";
import { Document, Page, Text, usePDF, View } from "@react-pdf/renderer";
import { ChevronLeft, Download } from "lucide-react";
import React, { useEffect, useId, useMemo } from "react";
import { useNavigate } from "react-router";
import SeriePrintHeader from "@/components/SeriePrintHeader";
import SerieTeamCategoryCombobox from "@/components/SerieTeamCategoryCombobox";
import { Button } from "@/components/ui/button";
import PdfConsts from "@/consts/PdfConsts";
import usePDFActions from "@/hooks/use-pdf-actions";
import { SerieContext } from "@/types/SerieContext";
import type { Series } from "@/types/Series";
import { pdfStyle } from "@/utils/renderUtils";
import type { SummedSerieTeam } from "@/utils/seriesUtils";
import ResultTable from "./components/ResultTable";

export default function SerieTeamResults() {
	const { serie, teamCategory, teamResults } = React.useContext(SerieContext);
	const navigate = useNavigate();
	const { printPDF, downloadPDF } = usePDFActions();
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
					style={[pdfStyle.DoubleColumn.Header.view, { width: "15%" }]}
					key={`${id}`}>
					<Text>{placements.compName}</Text>
					<View style={{ display: "flex", flexDirection: "row" }}>
						<Text style={pdfStyle.DoubleColumn.Header.text}>Miejsce</Text>
						<Text style={pdfStyle.DoubleColumn.Header.text}>Wynik</Text>
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
			<div className="w-full flex gap-5 items-center px-4 h-[8vh]">
				<Button
					variant={"outline"}
					onClick={() => navigate("..")}>
					<ChevronLeft /> Wróć
				</Button>
				<SerieTeamCategoryCombobox />
				<Button
					disabled={instance.loading}
					onClick={async () =>
						await downloadPDF(
							instance.blob,
							`${serie.name}-${teamCategory}.pdf`,
						)
					}>
					<Download /> {instance.loading ? "Ładowanie..." : "Pobierz"}
				</Button>
				<Button
					disabled={instance.loading}
					onClick={async () => await printPDF(instance.blob)}>
					<Print /> Drukuj
				</Button>
			</div>
			{instance.loading && <p>Ładowanie wyników...</p>}
			{instance.error && <p>Error: {instance.error}</p>}

			{instance.url && (
				<div className="h-[92vh]">
					{/* Display PDF in iframe */}
					<iframe
						src={instance.url}
						width="100%"
						height="100%"
						title="PDF Preview"
					/>
				</div>
			)}
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
