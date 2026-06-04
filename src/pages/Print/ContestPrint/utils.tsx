import { Text } from "@react-pdf/renderer";
import {
	sortByContestWithDoubleScore,
	sortByContestWithMultiplier,
	sortByContestWithTime,
} from "@/utils/sortUtils";
import type { ResultRow } from "./ContestResults";

export const getAdditionalHeaders = (
	contestType: "double" | "time" | "single",
) => {
	if (contestType === "time") {
		return {
			headers: ["Wynik", "Czas"],
			rowRenderer: (row: ResultRow) => (
				<>
					<Text style={{ width: "20%", textAlign: "center" }}>
						{row.contestData.score}
					</Text>
					<Text style={{ width: "20%", textAlign: "center" }}>
						{row.contestData.time?.replace(/\./g, ":")}
					</Text>
				</>
			),
		};
	}

	if (contestType === "double") {
		return {
			headers: ["Rzut 1", "Rzut 2", "Razem"],
			rowRenderer: (row: ResultRow) => (
				<>
					<Text style={{ width: "20%", textAlign: "center" }}>
						{row.contestData.score || 0}
					</Text>
					<Text style={{ width: "20%", textAlign: "center" }}>
						{row.contestData.second_score || 0}
					</Text>
					<Text style={{ width: "20%", textAlign: "center" }}>
						{(
							(row.contestData.score || 0) + (row.contestData.second_score || 0)
						).toFixed(2)}
					</Text>
				</>
			),
		};
	}

	return {
		headers: ["Rzut", "Wynik"],
		rowRenderer: (row: ResultRow) => (
			<>
				<Text style={{ width: "20%", textAlign: "center" }}>
					{row.contestData.score}
				</Text>
				<Text style={{ width: "20%", textAlign: "center" }}>
					{(row.contestData.score * 1.5).toFixed(2)}
				</Text>
			</>
		),
	};
};

export const getCompetitionScoreSorter = (
	contestType: "double" | "time" | "single",
) => {
	if (contestType === "time")
		return (a: ResultRow, b: ResultRow) => {
			return sortByContestWithTime(a.contestData, b.contestData);
		};

	if (contestType === "double")
		return (a: ResultRow, b: ResultRow) => {
			return sortByContestWithDoubleScore(a.contestData, b.contestData);
		};

	return (a: ResultRow, b: ResultRow) => {
		return sortByContestWithMultiplier(a.contestData, b.contestData);
	};
};
