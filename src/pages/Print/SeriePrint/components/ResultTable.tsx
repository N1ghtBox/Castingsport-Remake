import PdfConsts from "@/consts/PdfConsts";
import { pdfT } from "@/i18n/pdfLang";
import { SerieContestantResult } from "@/types/Series";
import { Text, View } from "@react-pdf/renderer";

type ItemsTableProps = {
	data: SerieContestantResult[];
	headers: JSX.Element[];
};

const ResultTable = ({ data, headers }: ItemsTableProps) => {
	return (
		<View style={PdfConsts.styles.table}>
			<View
				style={[
					PdfConsts.styles.row,
					PdfConsts.styles.bold,
					PdfConsts.styles.header,
				]}>
				<Text style={[PdfConsts.styles.placeCol, PdfConsts.styles.marginTop]}>
					{pdfT("table.place")}
				</Text>
				<Text
					style={[
						PdfConsts.styles.col,
						PdfConsts.styles.marginTop,
						{ width: "15%" },
					]}>
					{pdfT("table.fullName")}
				</Text>
				{headers}
				<Text style={[PdfConsts.styles.placeCol, PdfConsts.styles.marginTop]}>
					{pdfT("table.totalScore")}
				</Text>
				<Text style={[PdfConsts.styles.col, PdfConsts.styles.marginTop]}>
					{pdfT("table.points")}
				</Text>
			</View>
			{data.map((row, i) => (
				<View
					key={row.id}
					style={[
						PdfConsts.styles.row,
						{
							borderBottom:
								i === data.length - 1 ? "1px solid black" : "1px solid #d6d6d6",
						},
					]}
					wrap={false}>
					<Text style={[PdfConsts.styles.placeCol, PdfConsts.styles.bold]}>
						{i + 1}
					</Text>
					<Text style={[PdfConsts.styles.col, { width: "15%" }]}>
						{row.name}
					</Text>
					{row.placements.map((comp) => (
						<View
							key={comp.competitionName}
							style={[
								PdfConsts.styles.doubleColumnRow_View,
								{
									width: "15%",
									borderRight: "1px solid #d6d6d6",
									borderLeft: "1px solid #d6d6d6",
								},
							]}>
							<Text style={PdfConsts.styles.doubleColumnRow_Text}>
								{comp.place}
							</Text>
							<Text style={PdfConsts.styles.doubleColumnRow_Text}>
								{comp.score.toFixed(2)}
							</Text>
						</View>
					))}
					<Text style={[PdfConsts.styles.placeCol]}>
						{row.total.toFixed(2)}
					</Text>
					<Text style={[PdfConsts.styles.col]}>{row.place}</Text>
				</View>
			))}
		</View>
	);
};

export default ResultTable;
