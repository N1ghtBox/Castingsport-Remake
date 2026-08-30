import { Document, Page, Text, usePDF, View } from "@react-pdf/renderer";
import { useEffect, useId, useMemo } from "react";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import PrintWarning from "@/components/PrintWarning";
import SeriePrintHeader from "@/components/SeriePrintHeader";
import PdfConsts from "@/consts/PdfConsts";
import { useSerieContext } from "@/context/serie/SerieContext";
import type { Series, SerieTeamResult } from "@/types/Series";
import { pdfT, usePdfLang } from "@/i18n/pdfLang";
import ResultTable from "./components/ResultTable";

export default function SerieTeamResults() {
	const { serie, teamCategory, teamResults } = useSerieContext();
	const id = useId();
	const [pdfLang] = usePdfLang();

	const results: SerieTeamResult[] = useMemo(() => {
		return teamResults
			.filter((x) => {
				return x.category === teamCategory;
			})
			.map((con, i) => ({
				...con,
				compPlacements: con.placements.sort((a, b) =>
					a.competitionName.localeCompare(b.competitionName, undefined, {}),
				),
				seriePlace: i + 1,
			}));
	}, [teamResults, teamCategory]);

	const headers = useMemo(() => {
		if (!results[0]) return [];

		return results[0].placements
			.sort((a, b) => a.competitionName.localeCompare(b.competitionName))
			.map((placements) => (
				<View
					style={[PdfConsts.styles.doubleColumnHeader_View, { width: "15%" }]}
					key={`${id}`}>
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
	}, [results, id, pdfLang]);

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
				invalid={!teamCategory}
				printName={`${serie.name}-${teamCategory}.pdf`}
			/>
			<PrintDisplay
				instance={instance}
				invalidComponent={
					!teamCategory ? (
						<PrintWarning warning="Należy wybrać kategorie" />
					) : undefined
				}
			/>
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
	results: SerieTeamResult[];
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
						<Text style={PdfConsts.styles.titleEventTop}>{pdfT("nav.contests")} 1-5</Text>
						<Text style={PdfConsts.styles.titleEventBottom}>{pdfT("thlon.n", { n: 5 })}</Text>
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
