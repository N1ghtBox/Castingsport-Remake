import { ChevronLeft } from "@mui/icons-material";
import { type LucideProps, TrophyIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { Button } from "./components/ui/button";
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
import {
	Categories,
	type CategoryValues,
	type TeamCategoryValues,
	Thlon,
} from "./types/Contestant";
import { SerieContext } from "./types/SerieContext";
import type { Series } from "./types/Series";
import { TeamCategory } from "./types/Teams";
import {
	calculateSerieScores,
	calculateSerieTeamScores,
	getSerieData,
	type SummedSerieContestant,
	type SummedSerieTeam,
} from "./utils/seriesUtils";

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
		title: "Podsumowania",
		icon: TrophyIcon,
		tabs: [
			{
				title: "5-bój",
				url: `summary/${Thlon["5boj"].from}/${Thlon["5boj"].to}`,
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
				url: "summary/teams",
			},
		],
	},
];

export default function SerieLayout() {
	const { serie } = useLoaderData() as { serie: string };
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("");
	const [serieData, setSerieData] = useState<Series>({
		id: "",
		name: "",
		year: new Date().getFullYear(),
		competitionIds: [],
	});
	const [category, setCategory] = useState<CategoryValues>(Categories.Man);
	const [teamCategory, setTeamCategory] = useState<TeamCategoryValues>(
		TeamCategory.Junior,
	);
	const [results, setResults] = useState<
		Record<keyof typeof Thlon, SummedSerieContestant[]>
	>({
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
			const [serieData] = await Promise.all([getSerieData(serie)]);
			if (!serieData) return;
			setSerieData(serieData);
			const [result, teamResults] = await Promise.all([
				calculateSerieScores(serieData),
				calculateSerieTeamScores(serieData),
			]);
			setResults(result);
			setTeamResults(teamResults);
		}
		fetchComp();
	}, [serie]);

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>{serieData.name}</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
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
				</SidebarContent>
				<SidebarFooter>
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
				<SerieContext.Provider
					value={{
						serie: serieData,
						serieResults: results,
						category: category,
						setCategory: (val) => setCategory(val as CategoryValues),
						setTeamCategory: (val) =>
							setTeamCategory(val as TeamCategoryValues),
						teamResults: teamResults,
						teamCategory: teamCategory,
					}}>
					<Outlet />
				</SerieContext.Provider>
			</SidebarInset>
		</SidebarProvider>
	);
}
