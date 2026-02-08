import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyle = {
	Table: {
		width: "100%",
	},
	Bold: {
		fontWeight: "bold",
	},
	Row: {
		display: "flex",
		flexDirection: "row",
		paddingTop: 8,
		paddingBottom: 8,
	},
	DoubleColumn: {
		Header: {
			text: {
				width: "50%",
				textAlign: "center",
			},
			view: {
				width: "20%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			},
		},
		Row: {
			text: {
				width: "50%",
				textAlign: "center",
			},
			view: {
				width: "20%",
				display: "flex",
				flexDirection: "row",
			},
		},
	},
	SingleColumn: {
		Header: {
			width: "20%",
			textAlign: "center",
			marginTop: 11,
		},
		Row: {
			width: "20%",
			textAlign: "center",
		},
	},
} as const;

const PdfConsts = {
	styles: StyleSheet.create({
		col10: {
			width: "10%",
			textAlign: "center",
		},
		col15: {
			width: "15%",
			textAlign: "center",
		},
		col20: {
			width: "20%",
			textAlign: "center",
		},
		col25: {
			width: "25%",
			textAlign: "center",
		},
		singleColumnHeader: {
			width: "20%",
			textAlign: "center",
			marginTop: 11,
		},
		singleColumnRow: {
			width: "20%",
			textAlign: "center",
		},
		doubleColumnHeader_Text: {
			width: "50%",
			textAlign: "center",
		},
		doubleColumnHeader_View: {
			width: "20%",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
		},
		doubleColumnRow_Text: {
			width: "50%",
			textAlign: "center",
		},
		doubleColumnRow_View: {
			width: "20%",
			display: "flex",
			flexDirection: "row",
		},
		table: {
			width: "100%",
		},
		row: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			paddingTop: 4,
			paddingBottom: 4,
		},
		page: {
			backgroundColor: "transparent",
			width: "100%",
			fontSize: 8,
			fontFamily: "Roboto",
		},
		section: {
			margin: 10,
			padding: 10,
			flexGrow: 1,
		},
		header: {
			borderTop: "none",
		},
		bold: {
			fontWeight: "bold",
		},
		col: {
			width: "10%",
			textAlign: "center",
		},
		placeCol: {
			width: "5%",
			textAlign: "center",
		},
		marginTop: {
			marginTop: 10,
		},
		titleWrapper: {
			display: "flex",
			flexDirection: "row",
			height: "10vh",
			marginTop: "2.5vh",
			alignItems: "center",
			justifyContent: "space-between",
		},
		titleCategory: {
			marginLeft: "10%",
			backgroundColor: "aqua",
			fontWeight: "bold",
			fontSize: "1.5rem",
			padding: "5px 20px",
		},
		titleEventTop: {
			fontSize: "1.5rem",
			borderBottom: "3px solid black",
			padding: "0px 10px",
			fontWeight: "bold",
			paddingBottom: "2px",
		},
		titleEventBottom: {
			fontSize: "1.2rem",
			padding: "0px 10px",
			paddingBottom: "2px",
		},
		titleEventWrapper: { flex: 0.35, textAlign: "center", marginRight: "5%" },
	}),
	creator: "Castingsport Dawid Witczak",
	title: "Contest Results",
} as const;

export default PdfConsts;
