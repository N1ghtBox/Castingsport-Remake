import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { toast } from "sonner";
import { useBaseContext } from "@/context/base/BaseContext";
import { MenuContext } from "@/context/menu/MenuContext";
import type { MenuContextProps } from "@/context/menu/MenuContext.types";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
import type { Competition } from "@/types/Competition";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import type { Series } from "../../types/Series";
import { getGeneralData } from "../../utils/jsonUtils";
import TabHeader from "./components/TabHeader";
import TabSelector from "./components/TabSelector";

export default function GeneralListsLayout() {
	const [competitions, setCompetitions] = useState<Array<Competition>>([]);
	const [series, setSeries] = useState<Array<Series>>([]);
	const { setLoading } = useBaseContext();

	const fetchCompetitions = useCallback(async () => {
		try {
			setLoading(true);
			const json = await getGeneralData();

			setCompetitions(json.competitions);
			setSeries(json.series);
		} catch (ex) {
			toast.error("Nie udało się zaczytać danych");
			LoggingProvider.LogException("Error during loading menu.", ex);
		} finally {
			setLoading(false);
		}
	}, [setLoading]);

	useEffect(() => {
		fetchCompetitions();
	}, [fetchCompetitions]);

	return (
		<SidebarProvider>
			<TabSelector competitions={competitions} />
			<SidebarInset className="w-100">
				<TabHeader />
				<MenuContext.Provider
					value={
						{
							competitions: competitions,
							series: series,
							refresh: fetchCompetitions,
						} as MenuContextProps
					}>
					<Outlet />
				</MenuContext.Provider>
			</SidebarInset>
		</SidebarProvider>
	);
}
