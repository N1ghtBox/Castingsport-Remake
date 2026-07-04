import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Contests } from "@/types/Contestant";
import type { TimelineContestant } from "@/types/TimelineData";

const styles = StyleSheet.create({
	table: {
		width: "100%",
	},
	row: {
		display: "flex",
		flexDirection: "row",
		paddingTop: 2,
		paddingBottom: 2,
	},
	marginTop: {
		marginTop: 10,
	},
	header: {
		borderTop: "none",
	},
	bold: {
		fontWeight: "bold",
	},
	col1: {
		textAlign: "center",
	},
	eventTitle: {
		fontWeight: "bold",
		fontSize: "1.8rem",
	},
	platfromTitle: {
		fontWeight: "bold",
		fontSize: "1.5rem",
	},
});

const ScoreTablePlatform = ({
	number,
	cont,
	event,
	castCount,
	contestName,
	contestLabel,
	platformLabel,
	contestantLabel,
	castLabel,
	signatureLabel,
}: ScoreTablePlatformParams) => {
	return (
		<View style={{ paddingHorizontal: "2.5%", paddingVertical: "3%" }}>
			<Text style={[styles.eventTitle]}>
				{contestLabel} {event} - {contestName}
			</Text>
			<Text style={[styles.platfromTitle]}>{platformLabel} {number}</Text>
			<View style={styles.table}>
				<View style={[styles.row, styles.bold, styles.header]}>
					<Text style={[styles.col1, styles.marginTop, { width: "25%" }]}>
						{contestantLabel}
					</Text>
					{Array.from({ length: castCount }, (_, i) => i).map((x) => (
						<Text
							key={x}
							style={[
								styles.col1,
								styles.marginTop,
								{ width: `${60 / castCount}%` },
							]}>
							{castLabel} {x + 1}
						</Text>
					))}
					<Text style={[styles.col1, styles.marginTop, { width: "15%" }]}>
						{signatureLabel}
					</Text>
				</View>
				{cont?.map((row, i) => (
					<View
						// biome-ignore lint/suspicious/noArrayIndexKey: Todo
						key={i}
						style={[styles.row]}
						wrap={false}>
						<View
							style={[
								{
									width: "25%",
									paddingHorizontal: "2px",
									display: "flex",
									justifyContent: "center",
									alignItems: "flex-start",
								},
							]}>
							<Text style={[styles.bold, { fontSize: "12px" }]}>
								{row.number}. {row.name}
							</Text>
						</View>
						{Array.from({ length: castCount }, (_, i) => i).map((x) => (
							<View
								key={x}
								style={[
									{
										width: `${60 / castCount}%`,
										height: "60px",
										paddingHorizontal: "5px",
										border: "1px solid black",
									},
								]}></View>
						))}
						<View
							style={[
								{
									width: "15%",
									height: "60px",
									paddingHorizontal: "2px",
									border: "1px solid black",
								},
							]}></View>
					</View>
				))}
			</View>
		</View>
	);
};

type ScoreTablePlatformParams = {
	cont: TimelineContestant[];
	number: number;
	event: Contests;
	castCount: number;
	contestName: string;
	contestLabel: string;
	platformLabel: string;
	contestantLabel: string;
	castLabel: string;
	signatureLabel: string;
};

export default ScoreTablePlatform;
