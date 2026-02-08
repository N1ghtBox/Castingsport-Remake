import { useEffect, useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import { SerieContext } from "@/context/serie/SerieContext";
import type { SerieContextProps } from "@/context/serie/SerieContext.types";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { Categories, type CategoryValues } from "../../types/Contestant";
import type { Series, SeriesResults } from "../../types/Series";
import { TeamCategory, type TeamCategoryValues } from "../../types/Teams";
import {
	calculateSerieScores,
	calculateSerieTeamScores,
	getSerieData,
	type SummedSerieTeam,
} from "../../utils/seriesUtils";
import TabHeader from "./components/TabHeader";
import TabSelector from "./components/TabSelector";

export default function SerieLayout() {
	const { serie } = useLoaderData() as { serie: string };
	const [activeTab, setActiveTab] = useState("");
	const [serieData, setSerieData] = useState<Series>({
		id: "",
		name: "",
		year: new Date().getFullYear(),
		competitionIds: [],
		type: "puchar",
	});
	const [category, setCategory] = useState<CategoryValues>(Categories.Man);
	const [teamCategory, setTeamCategory] = useState<TeamCategoryValues>(
		TeamCategory.Junior,
	);
	const [results, setResults] = useState<SeriesResults>({
		"3boj": [],
		"5boj": [],
		"7boj": [],
		"9boj": [],
		multi: [],
		distance: [],
	});
	const [teamResults, setTeamResults] = useState<SummedSerieTeam[]>([]);

	useEffect(() => {
		async function fetchComp() {
			try {
				LoggingProvider.LogInfo(`Loading data for Series id = ${serie}`);
				const [serieData] = await Promise.all([getSerieData(serie)]);
				if (!serieData) {
					LoggingProvider.LogWarning(`Data for Series not found`);
					return;
				}
				setSerieData(serieData);
				const [result, teamResults] = await Promise.all([
					calculateSerieScores(serieData),
					calculateSerieTeamScores(serieData),
				]);
				setResults(result);
				setTeamResults(teamResults);
			} catch (ex: unknown) {
				LoggingProvider.LogException(
					`Error during fetching data for Series`,
					ex,
				);
			}
		}
		fetchComp();
	}, [serie]);

	return (
		<SidebarProvider>
			<TabSelector
				setActiveTab={setActiveTab}
				activeTab={activeTab}
				serie={serieData}
			/>
			<SidebarInset className="w-100">
				<TabHeader activeTab={activeTab} />
				<SerieContext.Provider
					value={
						{
							serie: serieData,
							serieResults: results,
							category: category,
							setCategory: (val) => setCategory(val as CategoryValues),
							setTeamCategory: (val) =>
								setTeamCategory(val as TeamCategoryValues),
							teamResults: teamResults,
							teamCategory: teamCategory,
						} as SerieContextProps
					}>
					<Outlet />
				</SerieContext.Provider>
			</SidebarInset>
		</SidebarProvider>
	);
}
