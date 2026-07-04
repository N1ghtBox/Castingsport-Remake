import { ConfigProvider, theme } from "antd";
import enUS from "antd/locale/en_US";
import plPL from "antd/locale/pl_PL";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/pl";
import moment from "moment";
import "moment/dist/locale/en-gb";
import "moment/dist/locale/pl";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createHashRouter, RouterProvider } from "react-router";
import "./App.css";

import BaseLayout from "./layouts/base/BaseLayout";
import { PrintSettingsProvider } from "./context/printSettings/PrintSettingsContext";
import FontProvider from "./providers/FontProvider/FontProvider";
import AppPaths from "./providers/PathProvider";
import { LicenseGate } from "./providers/LicenseProvider/LicenseGate";
import { LicenseProvider } from "./providers/LicenseProvider/LicenseProvider";

dayjs.locale("pl");

FontProvider.RegisterFonts();

const { darkAlgorithm } = theme;

const router = createHashRouter(AppPaths);

export default function App() {
	const { i18n } = useTranslation();
	const isEnglish = i18n.resolvedLanguage === "en" || i18n.resolvedLanguage?.startsWith("en");
	const antdLocale = isEnglish ? enUS : plPL;

	useEffect(() => {
		const lang = isEnglish ? "en" : "pl";
		dayjs.locale(lang);
		moment.locale(isEnglish ? "en-gb" : "pl");
	}, [isEnglish]);

	return (
		<ConfigProvider
			theme={{
				token: {
					colorBgContainer: "rgba(37, 37, 37, 1)",
				},
				algorithm: darkAlgorithm,
				cssVar: true,
			}}
			locale={antdLocale}>
			<PrintSettingsProvider>
				<LicenseProvider>
					<LicenseGate>
						<BaseLayout>
							<RouterProvider router={router} />
						</BaseLayout>
					</LicenseGate>
				</LicenseProvider>
			</PrintSettingsProvider>
		</ConfigProvider>
	);
}
