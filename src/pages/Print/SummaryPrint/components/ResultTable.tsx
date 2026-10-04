import { Text, View } from "@react-pdf/renderer";
import PdfNation from "@/components/PdfNation";
import PdfConsts from "@/consts/PdfConsts";
import { pdfT } from "@/i18n/pdfLang";
import {
	RenderContestHeaderInPdf,
	RenderContestScoreInPdf,
} from "@/utils/renderUtils";
import type { ContestantWithThlonResult } from "../ThlonResults";

type ItemsTableProps = {
	data: ContestantWithThlonResult[];
	from: number;
	to: number;
	/** Set for international competitions, where every page carries the nation column. */
	showNation?: boolean;
};

const ResultTable = ({ data, from, to, showNation }: ItemsTableProps) => {
	return (
		<View style={PdfConsts.styles.table}>
			<View
				style={[
					PdfConsts.styles.row,
					PdfConsts.styles.bold,
					PdfConsts.styles.header,
				]}>
				<Text style={[PdfConsts.styles.col10, PdfConsts.styles.marginTop]}>
					{pdfT("table.place")}
				</Text>
				<Text style={[PdfConsts.styles.col20, PdfConsts.styles.marginTop]}>
					{pdfT("table.fullName")}
				</Text>
				{showNation && (
					<Text style={[PdfConsts.styles.col10, PdfConsts.styles.marginTop]}>
						{pdfT("table.nation")}
					</Text>
				)}
				<Text style={[PdfConsts.styles.col20, PdfConsts.styles.marginTop]}>
					{pdfT("table.club")}
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
					{showNation && (
						<PdfNation
							code={row.nation}
							style={PdfConsts.styles.col10}
						/>
					)}
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
