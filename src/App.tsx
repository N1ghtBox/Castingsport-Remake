import { Font } from "@react-pdf/renderer";
import { ConfigProvider, theme } from "antd";
import locale from "antd/locale/pl_PL";
import dayjs from "dayjs";
import "moment/dist/locale/pl";
import { createHashRouter, RouterProvider } from "react-router";
import "./App.css";

import "dayjs/locale/pl";
import AppPaths from "./providers/PathProvider";

dayjs.locale("pl");

Font.registerHyphenationCallback((word) => [word]);
// Register Font
Font.register({
	family: "Roboto",
	fonts: [
		{
			src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
			fontWeight: "normal",
		},
		{
			src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
			fontWeight: "bold",
		},
		{
			src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
			fontStyle: "italic",
		},
	],
});

const { darkAlgorithm } = theme;

const router = createHashRouter(AppPaths);

export default function App() {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorBgContainer: "rgba(37, 37, 37, 1)",
				},
				algorithm: darkAlgorithm,
				cssVar: true,
			}}
			locale={locale}>
			<RouterProvider router={router} />
		</ConfigProvider>
	);
}
