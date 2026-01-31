import { Document, Page, Text, usePDF, View } from "@react-pdf/renderer";
import React, { useEffect, useMemo } from "react";
import { useLoaderData } from "react-router";
import PrintActionButtons from "@/components/PrintActionButtons";
import PrintDisplay from "@/components/PrintDisplay";
import PdfConsts from "@/consts/PdfConsts";
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
			<PrintActionButtons
				instance={instance}
				printName={`${getThlonName(from, to)}-${contest.category}.pdf`}
			/>
			<PrintDisplay instance={instance} />
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
				style={PdfConsts.styles.page}>
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
