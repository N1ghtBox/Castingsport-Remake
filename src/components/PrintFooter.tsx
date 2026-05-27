import { Text, View } from "@react-pdf/renderer";
import moment from "moment";
import type React from "react";
import type { Competition } from "@/types/Competition";

type Props = {
	comp: Omit<Competition, "id"> | null;
};

const PrintFooter: React.FC<Props> = ({ comp }) => {
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
				<Text>Sędzia główny</Text>
				<Text>{comp?.mainJudge}</Text>
			</View>
			<View>
				<Text style={{ opacity: "0.5", fontSize: ".8rem" }}>
					{moment().format("DD MMMM yyyy HH:mm")}
				</Text>
			</View>
			<View>
				<Text>Sędzia sekretarz</Text>
				<Text>{comp?.secondaryJudge}</Text>
			</View>
		</View>
	);
};

export default PrintFooter;
