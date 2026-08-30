import { Check, Close } from "@mui/icons-material";
import { Text, View } from "@react-pdf/renderer";
import PdfConsts from "@/consts/PdfConsts";
import { pdfT } from "@/i18n/pdfLang";
import type { Contestant } from "@/types/Contestant";
import { TypeOfContest } from "./contestUtils";

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
			return `${contest.score} ${contest.second_score || 0}`;
		case "time":
			return `${contest.score}`;
		default:
			return `${(contest.score * 1.5).toFixed(2)}`;
	}
};

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
					style={PdfConsts.styles.doubleColumnRow_View}>
					<Text style={PdfConsts.styles.doubleColumnRow_Text}>
						{contest.score || 0}
					</Text>
					<Text style={PdfConsts.styles.doubleColumnRow_Text}>
						{contest.second_score || 0}
					</Text>
				</View>
			);
		case "time":
			return (
				<Text
					style={PdfConsts.styles.singleColumnRow}
					key={contestId}>
					{contest.score}
				</Text>
			);
		default:
			return (
				<View
					style={PdfConsts.styles.doubleColumnRow_View}
					key={contestId}>
					<Text style={PdfConsts.styles.doubleColumnRow_Text}>
						{contest.score || 0}
					</Text>
					<Text style={PdfConsts.styles.doubleColumnRow_Text}>
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
					style={PdfConsts.styles.doubleColumnHeader_View}
					key={contestId}>
					<Text>K-{contestId}</Text>
					<View style={{ display: "flex", flexDirection: "row" }}>
						<Text style={PdfConsts.styles.doubleColumnHeader_Text}>{pdfT("table.cast1")}</Text>
						<Text style={PdfConsts.styles.doubleColumnHeader_Text}>{pdfT("table.cast2")}</Text>
					</View>
				</View>
			);
		case "time":
			return (
				<Text
					style={PdfConsts.styles.singleColumnHeader}
					key={contestId}>
					K-{contestId}
				</Text>
			);
		default:
			return (
				<View
					style={PdfConsts.styles.doubleColumnHeader_View}
					key={contestId}>
					<Text>K-{contestId}</Text>
					<View style={{ display: "flex", flexDirection: "row" }}>
						<Text style={PdfConsts.styles.doubleColumnHeader_Text}>{pdfT("table.cast")}</Text>
						<Text style={PdfConsts.styles.doubleColumnHeader_Text}>{pdfT("table.score")}</Text>
					</View>
				</View>
			);
	}
};
