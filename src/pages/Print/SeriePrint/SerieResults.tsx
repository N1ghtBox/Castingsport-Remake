import { Print } from "@mui/icons-material";
import { Document, Page, Text, usePDF, View } from "@react-pdf/renderer";
import { ChevronLeft, Download } from "lucide-react";
import React, { useEffect, useId, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router";
import SerieCategoryCombobox from "@/components/SerieCategoryCombobox";
import SeriePrintHeader from "@/components/SeriePrintHeader";
import { Button } from "@/components/ui/button";
import PdfConsts from "@/consts/PdfConsts";
import usePDFActions from "@/hooks/use-pdf-actions";
import { SerieContext } from "@/types/SerieContext";
import type { Series } from "@/types/Series";
import { getThlonEnumName, getThlonName } from "@/utils/contestUtils";
import { pdfStyle } from "@/utils/renderUtils";
import type { SummedSerieContestant } from "@/utils/seriesUtils";
import ResultTable from "./components/ResultTable";

export default function SerieResults() {
	const { serie, category, serieResults } = React.useContext(SerieContext);
	const navigate = useNavigate();
	const { printPDF, downloadPDF } = usePDFActions();
	const { from, to } = useLoaderData();
	const id = useId();

	const results: SummedSerieContestant[] = useMemo(() => {
		const thlonName = getThlonEnumName(from, to);

		return serieResults[thlonName]
			.filter((x) => {
				if (thlonName === "distance" || thlonName === "multi") {
					if (x.category === "Junior") return category === "Mężczyzna";
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
					style={[pdfStyle.DoubleColumn.Header.view, { width: "15%", textAlign: 'center' }]}
					key={id}>
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
			<div className="w-full flex gap-5 items-center px-4 h-[8vh]">
				<Button
					variant={"outline"}
					onClick={() => navigate("..")}>
					<ChevronLeft /> Wróć
				</Button>
				<SerieCategoryCombobox />
				<Button
					disabled={instance.loading}
					onClick={async () =>
						await downloadPDF(instance.blob, `${serie.name}-${category}.pdf`)
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
