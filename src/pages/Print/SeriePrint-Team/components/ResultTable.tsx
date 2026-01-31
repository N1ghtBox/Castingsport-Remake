import { Text, View } from "@react-pdf/renderer";
import PdfConsts from "@/consts/PdfConsts";
import type { SummedSerieTeam } from "@/utils/seriesUtils";

type ItemsTableProps = {
	data: SummedSerieTeam[];
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
					Miejsce
				</Text>
				<Text
					style={[
						PdfConsts.styles.col,
						PdfConsts.styles.marginTop,
						{ width: "15%" },
					]}>
					Imię
				</Text>
				{headers}
				<Text style={[PdfConsts.styles.placeCol, PdfConsts.styles.marginTop]}>
					Łączny wynik
				</Text>
				<Text style={[PdfConsts.styles.col, PdfConsts.styles.marginTop]}>
					Punkty
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
							key={comp.compName}
							style={[
								PdfConsts.styles.doubleColumnHeader_View,
								{
									width: "15%",
									borderRight: "1px solid #d6d6d6",
									borderLeft: "1px solid #d6d6d6",
								},
							]}>
							<Text style={PdfConsts.styles.doubleColumnHeader_Text}>{comp.place}</Text>
							<Text style={PdfConsts.styles.doubleColumnHeader_Text}>
								{comp.score.toFixed()}
							</Text>
						</View>
					))}
					<Text style={[PdfConsts.styles.placeCol]}>
						{row.totalScore.toFixed(2)}
					</Text>
					<Text style={[PdfConsts.styles.col]}>{row.totalPlace}</Text>
				</View>
			))}
		</View>
	);
};

export default ResultTable;
