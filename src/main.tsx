import { createTheme, ThemeProvider } from "@mui/material";
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
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<Toaster />
			<App />
		</ThemeProvider>
	</React.StrictMode>,
);
