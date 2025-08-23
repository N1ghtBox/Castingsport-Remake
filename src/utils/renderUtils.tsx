import type { Contestant } from "@/types/Contestant";
import { Check, Close } from "@mui/icons-material";
import { TypeOfContest } from "./contestUtils";
import { Text, View } from "@react-pdf/renderer";

export const renderCheckIcon = (checked: boolean) => {
	if (checked) return <Check style={{ color: "green" }} />;
	return <Close style={{ color: "red" }} />;
};

export const RenderContestScore = (
	contestId: number,
	contestant: Contestant,
) => {
	const type = TypeOfContest(contestId);
	const contest = contestant.contests.find((x) => x.id === contestId);

	if (!contest) {
		return "-";
	}

	switch (type) {
		case "double":
			return `${contest.score}\t${contest.second_score || 0}`;
		case "time":
			return `${contest.score}`;
		default:
			return `${(contest.score * 1.5).toFixed(2)}`;
	}
};

export const pdfStyle = {
	DoubleColumn: {
		Header: {
			text: {
				width: "50%",
				textAlign: "center",
			},
			view: {
				width: "20%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			},
		},
		Row: {
			text: {
				width: "50%",
				textAlign: "center",
			},
			view: {
				width: "20%",
				display: "flex",
				flexDirection: "row",
			},
		},
	},
	SingleColumn: {
		Header: {
			width: "20%",
			textAlign: "center",
			marginTop: 11,
		},
		Row: {
			width: "20%",
			textAlign: "center",
		},
	},
} as const;

export const RenderContestScoreInPdf = (
	contestId: number,
	contestant: Contestant,
) => {
	const type = TypeOfContest(contestId);
	const contest = contestant.contests.find((x) => x.id === contestId);

	if (!contest) {
		return "-";
	}

	switch (type) {
		case "double":
			return (
				<View
					key={contestId}
					style={pdfStyle.DoubleColumn.Row.view}>
					<Text style={pdfStyle.DoubleColumn.Row.text}>
						{contest.score || 0}
					</Text>
					<Text style={pdfStyle.DoubleColumn.Row.text}>
						{contest.second_score || 0}
					</Text>
				</View>
			);
		case "time":
			return (
				<Text
					style={pdfStyle.SingleColumn.Row}
					key={contestId}>
					{contest.score}
				</Text>
			);
		default:
			return (
				<View
					style={pdfStyle.DoubleColumn.Row.view}
					key={contestId}>
					<Text style={pdfStyle.DoubleColumn.Row.text}>
						{contest.score || 0}
					</Text>
					<Text style={pdfStyle.DoubleColumn.Row.text}>
						{((contest.score || 0) * 1.5).toFixed(2)}
					</Text>
				</View>
			);
	}
};

export const RenderContestHeaderInPdf = (contestId: number) => {
	const type = TypeOfContest(contestId);

	switch (type) {
		case "double":
			return (
				<View
					style={pdfStyle.DoubleColumn.Header.view}
					key={contestId}>
					<Text>K-{contestId}</Text>
					<View style={{ display: "flex", flexDirection: "row" }}>
						<Text style={pdfStyle.DoubleColumn.Header.text}>Rzut 1</Text>
						<Text style={pdfStyle.DoubleColumn.Header.text}>Rzut 2</Text>
					</View>
				</View>
			);
		case "time":
			return (
				<Text
					style={pdfStyle.SingleColumn.Header}
					key={contestId}>
					K-{contestId}
				</Text>
			);
		default:
			return (
				<View
					style={pdfStyle.DoubleColumn.Header.view}
					key={contestId}>
					<Text>K-{contestId}</Text>
					<View style={{ display: "flex", flexDirection: "row" }}>
						<Text style={pdfStyle.DoubleColumn.Header.text}>Rzut</Text>
						<Text style={pdfStyle.DoubleColumn.Header.text}>Wynik</Text>
					</View>
				</View>
			);
	}
};
