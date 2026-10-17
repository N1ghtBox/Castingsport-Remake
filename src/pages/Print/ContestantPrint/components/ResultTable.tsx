import { Text, View } from "@react-pdf/renderer";
import PdfConsts from "@/consts/PdfConsts";
import { pdfT } from "@/i18n/pdfLang";
import { type Contestant, Thlon } from "@/types/Contestant";
import { getThlonNameKey, TakesPartInThlon } from "@/utils/contestUtils";

const thlons = ["3boj", "5boj", "multi", "distance"] as const satisfies ReadonlyArray<keyof typeof Thlon>;

const thlonLabel = (thlon: (typeof thlons)[number]) => {
	const { from, to } = Thlon[thlon];
	return pdfT(getThlonNameKey(from, to), { n: to - from + 1 });
};

type ItemsTableProps = {
	data: Contestant[];
};

const ResultTable = ({ data }: ItemsTableProps) => {
	return (
		<View style={[PdfConsts.styles.table, { paddingHorizontal: "5%" }]}>
			<View
				style={[
					PdfConsts.styles.row,
					PdfConsts.styles.bold,
					PdfConsts.styles.header,
				]}>
				<Text style={[PdfConsts.styles.col10, PdfConsts.styles.marginTop]}>
					{pdfT("table.startNumber")}
				</Text>
				<Text style={[PdfConsts.styles.col20, PdfConsts.styles.marginTop]}>
					{pdfT("table.fullName")}
				</Text>
				<Text style={[PdfConsts.styles.col20, PdfConsts.styles.marginTop]}>
					{pdfT("table.club")}
				</Text>
				<Text style={[PdfConsts.styles.col10, PdfConsts.styles.marginTop]}>
					{pdfT("table.category")}
				</Text>
				{thlons.map((thlon) => (
					<Text
						key={thlon}
						style={[PdfConsts.styles.col10, PdfConsts.styles.marginTop]}>
						{thlonLabel(thlon)}
					</Text>
				))}
			</View>
			{data.map((row, i) => (
				<View
					key={row.id}
					style={{
						...PdfConsts.styles.row,
						borderBottom:
							i === data.length - 1 ? "1px solid black" : "1px solid #d6d6d6",
					}}
					wrap={false}>
					<Text style={[PdfConsts.styles.col10, PdfConsts.styles.bold]}>
						{row.number}
					</Text>
					<Text style={PdfConsts.styles.col20}>{row.name}</Text>
					<Text style={PdfConsts.styles.col20}>{row.club}</Text>
					<Text style={PdfConsts.styles.col10}>
						{pdfT(`category.${row.category}`, { defaultValue: row.category })}
					</Text>
					{thlons.map((thlon) => (
						<Text
							key={thlon}
							style={[PdfConsts.styles.col10, PdfConsts.styles.bold]}>
							{TakesPartInThlon(row, thlon) ? "X" : ""}
						</Text>
					))}
				</View>
			))}
		</View>
	);
};

export default ResultTable;
