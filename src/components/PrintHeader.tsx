import { Image, Text, View } from "@react-pdf/renderer";
import moment from "moment";
import type React from "react";
import { getCompetitionLogo } from "@/utils/jsonUtils";
import CompetitionQrCode, { type QrCodeProps } from "./CompetitionQrCode";

type Props = {
	horizontal?: boolean;
	showQr?: boolean;
	/** Replaces the competition name, e.g. the subcategory of a dual competition. */
	title?: string;
} & Partial<QrCodeProps>;

const PrintHeader: React.FC<Props> = ({
	comp,
	horizontal,
	showQr = false,
	tab,
	category,
	title,
	subcategoryId,
}) => {
	// Competitions with subcategories are synced per subcategory only, so "all" has no page to link to
	const hasSyncedPage = !comp?.subcategories?.length || !!subcategoryId;

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
					marginRight: "2.5%",
					borderTopLeftRadius: "25%",
					borderTopRightRadius: "25%",
					borderBottomLeftRadius: "25%",
					borderBottomRightRadius: "25%",
				}}></Image>
			<View style={{ flex: 1, textAlign: "center", marginRight: "2.5%" }}>
				<Text
					style={{
						fontSize: "2rem",
						borderBottom: "3px solid black",
						padding: "0px 30px",
						fontWeight: "bold",
					}}>
					{title ?? comp?.name}
				</Text>
				<Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
					{comp?.place}, {moment(comp?.dateFrom).format("DD")}-
					{moment(comp?.dateTo).format("LL")}
				</Text>
			</View>

			{showQr && hasSyncedPage && (
				<CompetitionQrCode
					tab={tab ?? ""}
					category={category ?? ""}
					subcategoryId={subcategoryId}
					comp={comp!}
				/>
			)}
		</View>
	);
};

export default PrintHeader;
