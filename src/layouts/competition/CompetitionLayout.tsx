import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
import type { EditableTeam } from "@/types/Teams";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { CompetitionContext } from "../../context/competition/CompetitionContext";
import type { CompetitionContextProps } from "../../context/competition/CompetitionContext.types";
import type Competition from "../../types/Competition";
import { DefaultCompetition } from "../../types/CompetitionContext";
import type { EditableContestant } from "../../types/Contestant";
import {
	getCompData,
	getCompetitionInfo,
	updateCompConfig,
	updateCompData,
} from "../../utils/jsonUtils";
import { sortByStartingNumber } from "../../utils/sortUtils";
import TabHeader from "./components/TabHeader";
import TabSelector, { items } from "./components/TabSelector";

export default function CompetitionLayout() {
	const data = useLoaderData<string>();
	const [activeTab, setActiveTab] = useState("");
	const [loadingData, setLoadingData] = useState(true);
	const [rows, setRows] = React.useState<Array<EditableContestant>>([]);
	const [teams, setTeams] = React.useState<Array<EditableTeam>>([]);
	const [competition, setCompetition] =
		React.useState<Competition>(DefaultCompetition);

	useEffect(() => {
		// Start update in background
		(async () => {
			try {
				await updateCompData(data, rows, teams);
			} catch (e) {
				console.error("Update failed:", e);
			}
		})();
	}, [rows, data, teams]);

	useEffect(() => {
		async function fetchComp() {
			LoggingProvider.LogInfo(`Loading data for Competition id = ${data}`);

			setLoadingData(true);
			const [compData, compInfo] = await Promise.all([
				getCompData(data),
				getCompetitionInfo(data),
			]);
			if (!compInfo) {
				LoggingProvider.LogWarning(`Data for Competition not found`);
				return;
			}
			setCompetition({ ...compInfo });
			setRows(compData.contestants.map((x) => ({ ...x, isNew: false })));
			setTeams(compData.teams.map((x) => ({ ...x, isNew: false })));
			setLoadingData(false);
			LoggingProvider.LogInfo(`Data for Competition loaded`);
		}
		fetchComp();
	}, [data]);

	const updateConfig: CompetitionContextProps["updateConfig"] = async (
		settings,
	) => {

		setCompetition((prev) => ({
			...prev,
			platformConfig: settings.platformConfig,
			timeConfig: settings.timeConfig,
			orderConfig: settings.orderConfig,
		}));
		await updateCompConfig(competition.id, settings);
	};

	const setTab = useCallback((tab: number) => {
		const item = items
			.map((i) => i.tabs.find((t) => t.url === `contest/${tab}`))
			.filter(Boolean)[0];
		if (!item) return;
		setActiveTab(item.title);
	}, []);

	return (
		<SidebarProvider>
			<TabSelector
				setActiveTab={setActiveTab}
				activeTab={activeTab}
				competition={competition}
			/>
			<SidebarInset className="w-100">
				<TabHeader activeTab={activeTab} />

				<CompetitionContext.Provider
					value={
						{
							compInfo: competition,
							contestants: rows.sort(sortByStartingNumber),
							teams: teams,
							loading: loadingData,
							updateContestants: setRows,
							updateTeams: setTeams,
							setTab: setTab,
							updateConfig: updateConfig,
						} as CompetitionContextProps
					}>
					<Outlet />
				</CompetitionContext.Provider>
			</SidebarInset>
		</SidebarProvider>
	);
}
