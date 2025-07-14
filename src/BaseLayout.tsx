import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useNavigate } from "react-router";
import { Separator } from "./components/ui/separator";
import { MedalIcon, TrophyIcon } from "lucide-react";
import { createContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type Competition from "./types/Competition";
import { getGeneralData } from "./utils/jsonUtils";
import type { Series } from "./types/Series";
import type { MenuListContextProps } from "./types/MenuListContextProps";

export const MenuListContext = createContext<MenuListContextProps>({
	competitions: [],
	series: [],
	refresh: () => {
		return Promise.resolve()
	},
});

export default function Layout() {
	const [activeTab, setActiveTab] = useState<string>("");
	const navigate = useNavigate();
	const [competitions, setCompetitions] = useState<Array<Competition>>([]);
	const [series, setSeries] = useState<Array<Series>>([]);

	async function fetchCompetitions() {
		try {
			const json = await getGeneralData();
			console.log("fetched", { json })

			setCompetitions(json.competitions);
			setSeries(json.series);
		} catch {
			toast.error("Nie udało się zaczytać danych");
		}
	}

	useEffect(() => {
		fetchCompetitions();
	}, []);

	const competitionYears = useMemo(() => {
		const years = new Set([
			...competitions.map((x) => new Date(x.dateFrom).getFullYear()),
			new Date().getFullYear(),
		]);
		return Array.from(years).sort((a, b) => a - b);
	}, [competitions]);

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Zestawy</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem key={"Zawody"}>
									<SidebarMenuButton style={{ fontWeight: 700 }}>
										<TrophyIcon />
										Zawody
									</SidebarMenuButton>
									<SidebarMenuSub>
										{competitionYears.map((year) => (
											<SidebarMenuSubItem key={year}>
												<SidebarMenuSubButton
													onClick={() => {
														navigate(`competitions/${year}`);
														setActiveTab(`comp-${year}`);
													}}
													isActive={activeTab === `comp-${year}`}>
													{year}
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</SidebarMenuItem>
								<SidebarMenuItem key={"Series"}>
									<SidebarMenuButton style={{ fontWeight: 700 }}>
										<MedalIcon />
										Cykl Zawodów
									</SidebarMenuButton>
									<SidebarMenuSub>
										{competitionYears.map((year) => (
											<SidebarMenuSubItem key={year}>
												<SidebarMenuSubButton
													onClick={() => {
														navigate(`series/${year}`);
														setActiveTab(`series-${year}`);
													}}
													isActive={activeTab === `series-${year}`}>
													{year}
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			<SidebarInset className="w-100">
				<header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
					<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
						<SidebarTrigger className="text-foreground" />
						<Separator
							orientation="vertical"
							className="mx-2 data-[orientation=vertical]:h-4"
						/>
					</div>
				</header>
				<MenuListContext.Provider
					value={{ competitions: competitions, series: series, refresh: fetchCompetitions }}>
					<Outlet />
				</MenuListContext.Provider>
			</SidebarInset>
		</SidebarProvider>
	);
}
