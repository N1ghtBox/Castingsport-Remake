import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { useMemo } from "react";
import type { FormData } from "@/components/FinalsButton/types/FinalsForm.types";
import { sortByContestWithTime } from "@/utils/sortUtils";
import PdfConsts from "../../../../consts/PdfConsts";
import type { ResultRow } from "../ContestResults";

const styles = StyleSheet.create({
	col1: {
		width: "8%",
		textAlign: "center",
	},
	col2: {
		width: "20%",
		textAlign: "center",
	},
	col3: {
		width: "15%",
		textAlign: "center",
	},
	col4: {
		width: "20%",
		textAlign: "center",
	},
	col5: {
		width: "10%",
		textAlign: "center",
	},
	lowerTitle: {
		marginTop: "10px",
	},
});

type ItemsTableProps = {
	data: ResultRow[];

	additionalColumns?: {
		headers: string[];
		rowRenderer: (row: ResultRow) => JSX.Element;
	};
	finals: {
		finalCount: number | undefined;
		finalResults: FormData;
		finalSorter?: (a: ResultRow, b: ResultRow) => number;
	};
};

const ResultTable = ({ data, additionalColumns, finals }: ItemsTableProps) => {
	const Finals = finals.finalResults?.finals;

	const additionalStyles = Finals ? [styles.lowerTitle] : [];

	const isTimeFinale = Finals ? Finals[0]?.result !== undefined : false;

	const preparedData = useMemo(() => {
		if (!Finals) return data;

		const sortedFinals = isTimeFinale
			? [...Finals].sort((a, b) =>
				sortByContestWithTime(
					{ score: a.result ?? 0, time: a.time },
					{ score: b.result ?? 0, time: b.time },
				),
			)
			: [...Finals].sort(
				(a, b) =>
					parseFloat((b.score ?? "0").replace(",", ".")) -
					parseFloat((a.score ?? "0").replace(",", ".")),
			);

		const sortedData = sortedFinals
			.map((result) => {
				const contestant = data.find((p) => p.number === result.number);
				return contestant ? ({ ...contestant } as ResultRow) : null;
			})
			.filter((p): p is ResultRow => p !== null);

		const finalIds = new Set(sortedData.map((r) => r.number));
		return [...sortedData, ...data.filter((p) => !finalIds.has(p.number))];
	}, [Finals, data]);

	return (
		<View style={PdfConsts.styles.table}>
			<View
				style={[
					PdfConsts.styles.row,
					PdfConsts.styles.bold,
					PdfConsts.styles.header,
				]}>
				<Text style={[styles.col1, ...additionalStyles]}>Miejsce</Text>
				<Text style={[styles.col2, ...additionalStyles]}>Nr. Startowy</Text>
				<Text style={[styles.col2, ...additionalStyles]}>Imię i nazwisko</Text>
				<Text style={[styles.col2, ...additionalStyles]}>Okręg</Text>
				{additionalColumns?.headers.map((header) => (
					<Text
						key={header}
						style={[styles.col4, ...additionalStyles]}>
						{header}
					</Text>
				))}
				{finals.finalResults && (
					isTimeFinale ? (
						<View style={PdfConsts.styles.doubleColumnHeader_View}>
							<Text>Finały</Text>
							<View style={{ display: "flex", flexDirection: "row" }}>
								<Text style={{ ...PdfConsts.styles.doubleColumnHeader_Text, width: '40%' }}>Wynik</Text>
								<Text style={{ ...PdfConsts.styles.doubleColumnHeader_Text, width: '60%' }}>Czas</Text>
							</View>
						</View>
					) : (
						<Text style={PdfConsts.styles.singleColumnHeader}>Finały</Text>
					)
				)}
			</View>
			{preparedData.map((row, i) => {
				return (
					<View
						key={Finals ? `Finals-${row.number}` : row.number}
						style={{
							...PdfConsts.styles.row,
							borderBottom:
								i === data.length - 1 ||
									(finals.finalCount && i + 1 === finals.finalCount)
									? "1px solid black"
									: "1px solid #d6d6d6",
						}}
						wrap={false}>
						<Text style={[styles.col1, PdfConsts.styles.bold]}>{i + 1}</Text>
						<Text style={styles.col2}>{row.number}</Text>
						<Text style={styles.col2}>{row.name}</Text>
						<Text style={styles.col2}>{row.club}</Text>
						{additionalColumns?.rowRenderer(row)}
						{Finals && (
							isTimeFinale ? (
								<View style={PdfConsts.styles.doubleColumnRow_View}>
									<Text style={{ ...PdfConsts.styles.doubleColumnRow_Text, width: '40%' }}>
										{Finals.find((x) => x.number === row.number)?.result}
									</Text>
									<Text style={{ ...PdfConsts.styles.doubleColumnRow_Text, width: '60%' }}>
										{Finals.find((x) => x.number === row.number)?.time}
									</Text>
								</View>
							) : (
								<Text style={PdfConsts.styles.singleColumnRow}>
									{Finals.find((x) => x.number === row.number)?.score ?? ""}
								</Text>
							)
						)}
					</View>
				);
			})}
		</View>
	);
};

export default ResultTable;
