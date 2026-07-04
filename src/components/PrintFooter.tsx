import { Text, View } from "@react-pdf/renderer";
import moment from "moment";
import type React from "react";
import type { Competition } from "@/types/Competition";

type Props = {
	comp: Omit<Competition, "id"> | null;
	showCreatorFooter?: boolean;
	mainJudgeLabel: string;
	secretaryLabel: string;
	providedByLabel: string;
};

const PrintFooter: React.FC<Props> = ({ comp, showCreatorFooter, mainJudgeLabel, secretaryLabel, providedByLabel }) => {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				height: "5vh",
				marginTop: ".5vh",
				alignItems: "flex-start",
				justifyContent: "space-between",
				paddingHorizontal: "20px",
			}}>
			<View>
				<Text>{mainJudgeLabel}</Text>
				<Text>{comp?.mainJudge}</Text>
			</View>
			<View style={{ alignItems: "center" }}>
				{showCreatorFooter && (
					<Text style={{ opacity: 0.4, fontSize: ".7rem" }}>
						{providedByLabel}
					</Text>
				)}
				<Text style={{ opacity: "0.5", fontSize: ".8rem" }}>
					{moment().format("DD MMMM yyyy HH:mm")}
				</Text>
			</View>
			<View>
				<Text>{secretaryLabel}</Text>
				<Text>{comp?.secondaryJudge}</Text>
			</View>
		</View>
	);
};

export default PrintFooter;
