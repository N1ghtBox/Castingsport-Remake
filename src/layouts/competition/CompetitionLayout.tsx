import { debounce } from "@mui/material";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLoaderData } from "react-router";
import ProgramConsts from "@/consts/Consts";
import { FirestoreProvider } from "@/providers/FirestoreProvider/FirestoreProvider";
import { LoggingProvider } from "@/providers/LoggingProvider/LoggingProvider";
import type { Competition } from "@/types/Competition";
import type { EditableTeam } from "@/types/Teams";
import { generateSyncData } from "@/utils/syncUtils";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { CompetitionContext } from "../../context/competition/CompetitionContext";
import type { CompetitionContextProps } from "../../context/competition/CompetitionContext.types";
import type { EditableContestant } from "../../types/Contestant";
import {
	getCompData,
	getCompetitionInfo,
	updateCompConfig,
	updateCompData,
	updateCompInfo,
} from "../../utils/jsonUtils";
import { sortByStartingNumber } from "../../utils/sortUtils";
import TabHeader from "./components/TabHeader";
import TabSelector, { items } from "./components/TabSelector";

export default function CompetitionLayout() {
	const data = useLoaderData<string>();
	const [activeTab, setActiveTab] = useState("");
	const [rows, setRows] = React.useState<Array<EditableContestant>>([]);
	const [teams, setTeams] = React.useState<Array<EditableTeam>>([]);
	const [competition, setCompetition] = React.useState<Competition>(
		ProgramConsts.DefaultCompetition,
	);

	useEffect(() => {
		async function fetchComp() {
			LoggingProvider.LogInfo(`Loading data for Competition id = ${data}`);

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

	const syncToDb = useCallback(async () => {
		const syncData = generateSyncData(
			rows,
			competition.name,
			`${moment(competition?.dateFrom).format("DD")}-
					${moment(competition?.dateTo).format("LL")}`,
		);

		const lastSynced = moment().format("yyyy-MM-DD HH:mm:ss");

		setCompetition((prev) => ({
			...prev,
			lastSynced,
		}));

		updateCompInfo(data, { ...competition, lastSynced });

		FirestoreProvider.syncCompetitionData(data, syncData);
	}, [rows, data, competition]);

	useEffect(() => {
		// Start update in background
		(async () => {
			try {
				await updateCompData(data, rows, teams);
				debounce(syncToDb, 15000);
			} catch (e) {
				console.error("Update failed:", e);
			}
		})();
	}, [rows, data, teams, syncToDb]);

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
							updateContestants: setRows,
							updateTeams: setTeams,
							setTab: setTab,
							updateConfig: updateConfig,
							syncToDb: syncToDb,
						} as CompetitionContextProps
					}>
					<Outlet />
				</CompetitionContext.Provider>
			</SidebarInset>
		</SidebarProvider>
	);
}
