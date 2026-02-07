import { ChevronLeft, Construction } from "@mui/icons-material";
import { ListIcon, type LucideProps, TrophyIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { Button } from "./components/ui/button";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "./components/ui/sidebar";
import { CompetitionContext } from "./context/competition/CompetitionContext";
import type { CompetitionContextProps } from "./context/competition/CompetitionContext.types";
import type Competition from "./types/Competition";
import { DefaultCompetition } from "./types/CompetitionContext";
import { type Contestant, Contests, Thlon } from "./types/Contestant";
import type Team from "./types/Teams";
import {
	getCompData,
	getCompetitionInfo,
	updateCompConfig,
	updateCompData,
} from "./utils/jsonUtils";

type Tab = {
	title: string;
	url: string;
};

type Item = {
	title: string;
	icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
	tabs: Array<Tab>;
};

const items: Array<Item> = [
	{
		title: "Listy",
		icon: ListIcon,
		tabs: [
			{
				title: "Zawodnicy",
				url: "contestants",
			},
			{
				title: "Drużyny",
				url: "teams",
			},
		],
	},
	{
		title: "Konkurencje",
		icon: TrophyIcon,
		tabs: [
			{
				title: "K-1 Mucha cel",
				url: `contest/${Contests.FlySkish}`,
			},
			{
				title: "K-2 Mucha odległość",
				url: `contest/${Contests.FlyDistance}`,
			},
			{
				title: "K-3 Arenberg",
				url: `contest/${Contests.Arenberg}`,
			},
			{
				title: "K-4 Skish",
				url: `contest/${Contests.Skish}`,
			},
			{
				title: "K-5 Odległość spiningowa",
				url: `contest/${Contests.Distance}`,
			},
			{
				title: "K-6 Odległość mucha oburącz",
				url: `contest/${Contests.FlyDistanceDoubleHand}`,
			},
			{
				title: "K-7 Odległość spiningowa oburącz",
				url: `contest/${Contests.DistanceDoubleHand}`,
			},
			{
				title: "K-8 Skish multi",
				url: `contest/${Contests.MultiSkish}`,
			},
			{
				title: "K-9 Odległość multi",
				url: `contest/${Contests.MultiDistance}`,
			},
		],
	},
	{
		title: "Podsumowania",
		icon: TrophyIcon,
		tabs: [
			{
				title: "3-bój",
				url: `summary/${Thlon["3boj"].from}/${Thlon["3boj"].to}`,
			},
			{
				title: "5-bój",
				url: `summary/${Thlon["5boj"].from}/${Thlon["5boj"].to}`,
			},
			{
				title: "9-bój",
				url: `summary/${Thlon["9boj"].from}/${Thlon["9boj"].to}`,
			},
			{
				title: "2-bój multi",
				url: `summary/${Thlon.multi.from}/${Thlon.multi.to}`,
			},
			{
				title: "2-bój odległościowy",
				url: `summary/${Thlon.distance.from}/${Thlon.distance.to}`,
			},
			{
				title: "Drużynowe",
				url: "teams/summary",
			},
		],
	},
];

export default function CompetitionLayout() {
	const data = useLoaderData<string>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("");
	const [loadingData, setLoadingData] = useState(true);
	const [rows, setRows] = React.useState<
		Array<Contestant & { isNew: boolean }>
	>([]);
	const [teams, setTeams] = React.useState<Array<Team & { isNew: boolean }>>(
		[],
	);
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
			setLoadingData(true);
			const [compData, compInfo] = await Promise.all([
				getCompData(data),
				getCompetitionInfo(data),
			]);
			if (!compInfo) return;
			setCompetition({ ...compInfo });
			setRows(compData.contestants.map((x) => ({ ...x, isNew: false })));
			setTeams(compData.teams.map((x) => ({ ...x, isNew: false })));
			setLoadingData(false);
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
	}, [])

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader className="h-[fit]">{competition?.name}</SidebarHeader>
				<SidebarContent>
					<ScrollArea className="h-[100%] w-fit">
						<SidebarMenu>
							<SidebarMenuItem key={"Narzędzia"}>
								<SidebarMenuButton
									onClick={() => {
										setActiveTab("Narzędzia");
										navigate("");
									}}
									style={{ minHeight: "fit-content" }}
									isActive={"Narzędzia" === activeTab}>
									<Construction />
									Narzędzia
								</SidebarMenuButton>
							</SidebarMenuItem>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton style={{ fontWeight: 700 }}>
										<item.icon />
										{item.title}
									</SidebarMenuButton>
									<SidebarMenuSub>
										{item.tabs.map((tab) => (
											<SidebarMenuSubItem key={tab.title}>
												<SidebarMenuSubButton
													onClick={() => {
														setActiveTab(tab.title);
														navigate(tab.url);
													}}
													style={{ minHeight: "fit-content" }}
													isActive={tab.title === activeTab}>
													{tab.title}
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</ScrollArea>
				</SidebarContent>
				<SidebarFooter className="h-[8%]">
					<Button
						variant={"outline"}
						onClick={() => navigate("/")}>
						<ChevronLeft />
						Powrót
					</Button>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset className="w-100">
				<header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
					<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
						<SidebarTrigger className="text-foreground" />
						<Separator
							orientation="vertical"
							className="mx-2 data-[orientation=vertical]:h-4"
						/>
						<h1 className="text-base font-medium">{activeTab}</h1>
					</div>
				</header>

				<CompetitionContext.Provider
					value={
						{
							compInfo: competition,
							contestants: rows.sort((a, b) => a.number - b.number),
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
