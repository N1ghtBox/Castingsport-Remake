import { Text, View } from "@react-pdf/renderer";
import PdfConsts from "@/consts/PdfConsts";
import {
	RenderContestHeaderInPdf,
	RenderContestScoreInPdf,
} from "@/utils/renderUtils";
import type { ContestantWithThlonResult } from "../ThlonResults";

type ItemsTableProps = {
	data: ContestantWithThlonResult[];
	from: number;
	to: number;
};

const ResultTable = ({ data, from, to }: ItemsTableProps) => {
	return (
		<View style={PdfConsts.styles.table}>
			<View
				style={[
					PdfConsts.styles.row,
					PdfConsts.styles.bold,
					PdfConsts.styles.header,
				]}>
				<Text style={[PdfConsts.styles.col10, PdfConsts.styles.marginTop]}>
					Miejsce
				</Text>
				<Text style={[PdfConsts.styles.col20, PdfConsts.styles.marginTop]}>
					Imię i nazwisko
				</Text>
				<Text style={[PdfConsts.styles.col20, PdfConsts.styles.marginTop]}>
					Okręg
				</Text>
				{...Array.from({ length: to - from + 1 }, (_, i) => i + from).map(
					(contestId) => RenderContestHeaderInPdf(contestId),
				)}
				<Text style={[PdfConsts.styles.col20, PdfConsts.styles.marginTop]}>
					K {from}-{to}
				</Text>
			</View>
			{data.map((row, i) => (
				<View
					key={row.number}
					style={{
						...PdfConsts.styles.row,
						borderBottom:
							i === data.length - 1 ? "1px solid black" : "1px solid #d6d6d6",
					}}
					wrap={false}>
					<Text style={{ ...PdfConsts.styles.col10, ...PdfConsts.styles.bold }}>
						{row.place}
					</Text>
					<Text style={PdfConsts.styles.col20}>{row.name}</Text>
					<Text style={PdfConsts.styles.col20}>{row.club}</Text>
					{...Array.from({ length: to - from + 1 }, (_, i) => i + from).map(
						(contestId) => RenderContestScoreInPdf(contestId, row),
					)}
					<Text style={PdfConsts.styles.col20}>{row.total.toFixed(2)}</Text>
				</View>
			))}
		</View>
	);
};

export default ResultTable;
