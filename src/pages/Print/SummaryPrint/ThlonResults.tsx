import { Print } from "@mui/icons-material";
import {
	Document,
	Font,
	Page,
	StyleSheet,
	Text,
	usePDF,
	View,
} from "@react-pdf/renderer";
import { ChevronLeft, Download } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import ThlonCategoryCombobox from "@/components/ui/ThlonCategoryCombobox";
import usePDFActions from "@/hooks/use-pdf-actions";
import PrintFooter from "@/pages/PrintFooter";
import PrintHeader from "@/pages/PrintHeader";
import type Competition from "@/types/Competition";
import { CompetitonContext } from "@/types/CompetitionContext";
import type { Contestant } from "@/types/Contestant";
import { ContestContext } from "@/types/ContestContext";
import {
	FilterByCategory,
	GetThlonResult,
	getThlonName,
	TakesPartInContests,
} from "@/utils/contestUtils";
import ResultTable from "./components/ResultTable";

Font.registerHyphenationCallback((word) => [word]);
// Register Font
Font.register({
	family: "Roboto",
	fonts: [
		{
			src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
			fontWeight: "normal",
		},
		{
			src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
			fontWeight: "bold",
		},
		{
			src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
			fontStyle: "italic",
		},
	],
});
const styles = StyleSheet.create({
	page: {
		backgroundColor: "transparent",
		width: "100%",
		fontSize: 8,
		fontFamily: "Roboto",
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1,
	},
});

export type ResultRow = {
	number: string;
	name: string;
	club: string;
	category: string;
};

export type ContestantWithThlonResult = Contestant & {
	place: number;
	total: number;
};

export default function ThlonResults() {
	const { from, to } = useLoaderData() as {
		competition: string;
		from: number;
		to: number;
		contestId: string;
	};
	const contest = React.useContext(ContestContext);
	const competitionContext = React.useContext(CompetitonContext);

	const navigate = useNavigate();
	const { printPDF, downloadPDF } = usePDFActions();

	const results: ContestantWithThlonResult[] = useMemo(() => {
		return competitionContext.contestants
			.filter((contestant) => TakesPartInContests(contestant, from, to))
			.filter((contestant) =>
				contest.category
					? FilterByCategory(contestant, contest.category, from, to)
					: false,
			)
			.map((contestant) => ({
				...contestant,
				total: GetThlonResult(contestant, from, to),
			}))
			.sort((a, b) => b.total - a.total)
			.map((contestant, index) => ({ ...contestant, place: index + 1 }));
	}, [from, to, contest.category, competitionContext.contestants]);

	const [instance, updateInstance] = usePDF({
		document: (
			<ResultDocument
				comp={competitionContext.compInfo}
				category={contest.category || "Nieznane"}
				from={from}
				to={to}
				results={results}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<ResultDocument
				comp={competitionContext.compInfo}
				category={contest.category || "Nieznane"}
				from={from}
				to={to}
				results={results}
			/>,
		);
	}, [
		competitionContext.compInfo,
		contest.category,
		from,
		to,
		results,
		updateInstance,
	]);

	return (
		<>
			<div className="w-full flex gap-5 items-center px-4 h-[8vh]">
				<Button
					variant={"outline"}
					onClick={() => navigate("..")}>
					<ChevronLeft /> Wróć
				</Button>
				<ThlonCategoryCombobox />
				<Button
					disabled={instance.loading}
					onClick={async () =>
						await downloadPDF(
							instance.blob,
							`${getThlonName(from, to)}-${contest.category}.pdf`,
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
	comp,
	category,
	from,
	to,
	results,
}: {
	comp: Omit<Competition, "id"> | null;
	category: string;
	from: number;
	to: number;
	results: ContestantWithThlonResult[];
}) {
	return (
		<Document
			title="Contest Results"
			creator="Castingsport Dawid Witczak">
			<Page
				size="A4"
				orientation={to - from + 1 >= 7 ? "landscape" : "portrait"}
				style={styles.page}>
				<PrintHeader
					comp={comp}
					horizontal={to - from + 1 >= 7}
				/>

				<View
					style={{
						display: "flex",
						flexDirection: "row",
						height: "10vh",
						marginTop: "2.5vh",
						alignItems: "center",
						justifyContent: "space-between",
					}}>
					<View
						style={{
							marginLeft: "10%",
							backgroundColor: "aqua",
							fontWeight: "bold",
							fontSize: "1.5rem",
							padding: "5px 20px",
						}}>
						<Text>{category}</Text>
					</View>
					<View style={{ flex: 0.35, textAlign: "center", marginRight: "5%" }}>
						<Text
							style={{
								fontSize: "1.5rem",
								borderBottom: "3px solid black",
								padding: "0px 10px",
								fontWeight: "bold",
								paddingBottom: "2px",
							}}>
							Konkurencje {from}-{to}
						</Text>
						<Text
							style={{
								fontSize: "1.2rem",
								padding: "0px 10px",
								paddingBottom: "2px",
							}}>
							{getThlonName(from, to)}
						</Text>
					</View>
				</View>
				<ResultTable
					data={results}
					from={from}
					to={to}
				/>
				<PrintFooter comp={comp} />
			</Page>
		</Document>
	);
}
