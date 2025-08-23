import { Print } from "@mui/icons-material";
import {
	Document,
	Page,
	StyleSheet,
	Text,
	usePDF,
	View,
} from "@react-pdf/renderer";
import { ChevronLeft, Download } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import PrintFooter from "@/components/PrintFooter";
import PrintHeader from "@/components/PrintHeader";
import { Button } from "@/components/ui/button";
import TeamCategoryCombobox from "@/components/ui/TeamCategoryCombobox";
import usePDFActions from "@/hooks/use-pdf-actions";
import type Competition from "@/types/Competition";
import { CompetitonContext } from "@/types/CompetitionContext";
import type { Contestant } from "@/types/Contestant";
import { TeamContext, type TeamContextProps } from "@/types/TeamsContext";
import ResultTable from "./components/ResultTable";

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

export default function TeamResults() {
	const competitionContext = React.useContext(CompetitonContext);
	const teamContext = React.useContext(TeamContext);
	const navigate = useNavigate();
	const { printPDF, downloadPDF } = usePDFActions();

	const [instance, updateInstance] = usePDF({
		document: (
			<ResultDocument
				comp={competitionContext.compInfo}
				category={teamContext.category}
				results={teamContext.teamResults}
			/>
		),
	});

	useEffect(() => {
		updateInstance(
			<ResultDocument
				comp={competitionContext.compInfo}
				category={teamContext.category}
				results={teamContext.teamResults}
			/>,
		);
	}, [
		competitionContext.compInfo,
		updateInstance,
		teamContext.teamResults,
		teamContext.category,
	]);

	return (
		<>
			<div className="w-full flex gap-5 items-center px-4 h-[8vh]">
				<Button
					variant={"outline"}
					onClick={() => navigate("..")}>
					<ChevronLeft /> Wróć
				</Button>
				<TeamCategoryCombobox />
				<Button
					disabled={instance.loading}
					onClick={async () =>
						await downloadPDF(
							instance.blob,
							`Drużyny-${teamContext.category}-5boj.pdf`,
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
	results,
}: {
	comp: Omit<Competition, "id">;
	category: string;
	results: TeamContextProps["teamResults"];
}) {
	return (
		<Document
			title="Contest Results"
			creator="Castingsport Dawid Witczak">
			<Page
				size="A4"
				style={styles.page}>
				<PrintHeader comp={comp} />

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
						<Text>Drużyny - {category}</Text>
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
							Konkurencje 1-5
						</Text>
						<Text
							style={{
								fontSize: "1.2rem",
								padding: "0px 10px",
								paddingBottom: "2px",
							}}>
							5-bój
						</Text>
					</View>
				</View>
				<ResultTable data={results} />
				<PrintFooter comp={comp} />
			</Page>
		</Document>
	);
}
