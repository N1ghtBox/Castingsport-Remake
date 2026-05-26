import { Image, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import type React from "react";
import { Competition } from "@/types/Competition";
import { getCompetitionLogo } from "@/utils/jsonUtils";
import CompetitionQrCode from "./CompetitionQrCode";

type Props = {
	comp: Competition | null;
	horizontal?: boolean;
	showQr?: boolean
};

const PrintHeader: React.FC<Props> = ({ comp, horizontal, showQr = false }) => {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				height: "10vh",
				marginTop: "2.5vh",
				alignItems: "center",
				justifyContent: "space-between",
			}}>
			<Image
				source={async () => await getCompetitionLogo(comp?.logoUrl)}
				style={{
					maxHeight: horizontal ? "100%" : "90%",
					maxWidth: horizontal ? "15%" : "20%",
					marginLeft: "5%",
					borderTopLeftRadius: "25%",
					borderTopRightRadius: "25%",
					borderBottomLeftRadius: "25%",
					borderBottomRightRadius: "25%",
				}}></Image>
			<View style={{ flex: 1, textAlign: "center", marginRight: "5%" }}>
				<Text
					style={{
						fontSize: "2rem",
						borderBottom: "3px solid black",
						padding: "0px 30px",
						fontWeight: "bold",
					}}>
					{comp?.name}
				</Text>
				<Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
					{comp?.place}, {moment(comp?.dateFrom).format("DD")}-
					{moment(comp?.dateTo).format("LL")}
				</Text>
			</View>

			{showQr && <CompetitionQrCode comp={comp!} />}
		</View>
	);
};

export default PrintHeader;
