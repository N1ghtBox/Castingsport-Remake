import { ConfigProvider, theme } from "antd";
import locale from "antd/locale/pl_PL";
import dayjs from "dayjs";
import "moment/dist/locale/pl";
import { createHashRouter, RouterProvider } from "react-router";
import "./App.css";

import "dayjs/locale/pl";
import BaseLayout from "./layouts/base/BaseLayout";
import FontProvider from "./providers/FontProvider/FontProvider";
import AppPaths from "./providers/PathProvider";
import { LicenseGate } from "./providers/LicenseProvider/LicenseGate";
import { LicenseProvider } from "./providers/LicenseProvider/LicenseProvider";

dayjs.locale("pl");

FontProvider.RegisterFonts();

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
			<LicenseProvider>
				<LicenseGate>
					<BaseLayout>
						<RouterProvider router={router} />
					</BaseLayout>
				</LicenseGate>
			</LicenseProvider>
		</ConfigProvider>
	);
}
