import "./i18n/config";
import { createTheme, ThemeProvider } from "@mui/material";
import type {} from "@mui/x-data-grid/themeAugmentation";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "./components/ui/sonner";

const theme = createTheme({
	defaultColorScheme: "dark",
	palette: {
		background: { default: "#0a0a0a", paper: "#0a0a0a" },
		text: { primary: "#fafafa", secondary: "#fafafa" },
		primary: {
			main: "#6034ff",
		},
	},
	components: {
		MuiDataGrid: {
			styleOverrides: {
				iconButtonContainer: {
					"& .MuiIconButton-root": { color: "#fafafa" },
				},
				sortIcon: { color: "#fafafa" },
				menuIconButton: { color: "#fafafa" },
				filterIcon: { color: "#fafafa" },
			},
		},
	},
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<Toaster />
			<App />
		</ThemeProvider>
	</React.StrictMode>,
);
