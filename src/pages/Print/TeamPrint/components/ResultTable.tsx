import { Text, View } from "@react-pdf/renderer";
import PdfConsts from "@/consts/PdfConsts";
import type { TeamContextProps } from "@/context/team/TeamContext.types";
import { pdfT } from "@/i18n/pdfLang";
import type { ContestantWithThlonResult } from "../TeamResults";

type ItemsTableProps = {
	data: TeamContextProps["teamResults"];
	additionalColumns?: {
		headers: string[];
		rowRenderer: (row: ContestantWithThlonResult) => JSX.Element;
		sortData?: (
			a: ContestantWithThlonResult,
			b: ContestantWithThlonResult,
		) => number;
	};
};

const ResultTable = ({ data }: ItemsTableProps) => {
	return (
		<View style={PdfConsts.styles.table}>
			<View
				style={[
					PdfConsts.styles.row,
					PdfConsts.styles.bold,
					PdfConsts.styles.header,
				]}>
				<Text style={[PdfConsts.styles.col10, PdfConsts.styles.marginTop]} />
				<Text style={[PdfConsts.styles.col10, PdfConsts.styles.marginTop]}>
					{pdfT("table.place")}
				</Text>
				<Text style={[PdfConsts.styles.col25, PdfConsts.styles.marginTop]}>
					{pdfT("table.name")}
				</Text>
				<Text style={[PdfConsts.styles.col25, PdfConsts.styles.marginTop]}>
					{pdfT("table.members")}
				</Text>
				<Text style={[PdfConsts.styles.col25, PdfConsts.styles.marginTop]}>
					{pdfT("table.total")}
				</Text>
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
					<Text
						style={{ ...PdfConsts.styles.col10, ...PdfConsts.styles.bold }}
					/>
					<View
						style={[
							PdfConsts.styles.col10,
							PdfConsts.styles.bold,
							{ height: "100%", display: "flex", justifyContent: "center" },
						]}>
						<Text>{row.place}</Text>
					</View>
					<View
						style={[
							PdfConsts.styles.col25,
							{ height: "100%", display: "flex", justifyContent: "center" },
						]}>
						<Text>{row.name}</Text>
					</View>
					<View style={PdfConsts.styles.col25}>
						{row.members.map((member) => {
							return (
								<View
									key={member.name}
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
									}}>
									<Text>{member.name}</Text>
									<Text>{member.total} {pdfT("table.pts")}</Text>
								</View>
							);
						})}
					</View>
					<View
						style={[
							PdfConsts.styles.col25,
							{ height: "100%", display: "flex", justifyContent: "center" },
						]}>
						<Text>{row.total.toFixed(2)} {pdfT("table.pts")}</Text>
					</View>
				</View>
			))}
		</View>
	);
};

export default ResultTable;
