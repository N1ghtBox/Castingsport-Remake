import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import { flagForPdf, flagUrl } from "@/consts/Nations";

const styles = StyleSheet.create({
	cell: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	flag: {
		width: 12,
		height: 8,
		marginRight: 3,
		// Without it a white-edged flag (Poland, Japan) loses its top half against the paper.
		borderWidth: 0.5,
		borderStyle: "solid",
		borderColor: "#999999",
	},
});

type ViewStyle = NonNullable<React.ComponentProps<typeof View>["style"]>;

type Props = {
	code?: string;
	/** Column width, passed in by the table so the cell lines up with its header. */
	style: ViewStyle;
};

/** Flag plus code — the code stays because it survives a black-and-white printer. */
export default function PdfNation({ code, style }: Props) {
	const source = code && flagUrl(code) ? () => flagForPdf(code) : undefined;

	return (
		<View style={[styles.cell, ...(Array.isArray(style) ? style : [style])]}>
			{source && (
				<Image
					source={source}
					style={styles.flag}
				/>
			)}
			<Text>{code}</Text>
		</View>
	);
}
