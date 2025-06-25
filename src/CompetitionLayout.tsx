import { ChevronLeft } from "@mui/icons-material";
import { ListIcon, TrophyIcon, type LucideProps } from "lucide-react";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { Button } from "./components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarTrigger } from "./components/ui/sidebar";
import { type Contestant, Contests, Thlon } from "./types/Contestant";
import { createContext, useEffect, useState } from "react";
import { Separator } from "./components/ui/separator";
import type { CompetitionContextProps } from "./types/CompetitionContext";
import React from "react";
import { getCompData, getCompetitionInfo, updateCompData } from "./utils/jsonUtils";
import type Competition from "./types/Competition";
import type Team from "./types/Teams";

type Tab = {
    title: string;
    url: string;
}

type Item = {
    title: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    tabs: Array<Tab>
}

const items: Array<Item> = [{
    title: "Listy",
    icon: ListIcon,
    tabs: [
        {
            title: "Zawodnicy",
            url: 'contestants'
        },
        {
            title: "Drużyny",
            url: 'teams'
        },
    ],
},
{
    title: "Konkurencje",
    icon: TrophyIcon,
    tabs: [
        {
            title: "K-1 Mucha cel",
            url: `contest/${Contests.FlySkish}`
        },
        {
            title: "K-2 Mucha odległość",
            url: `contest/${Contests.FlyDistance}`
        },
        {
            title: "K-3 Arenberg",
            url: `contest/${Contests.Arenberg}`
        },
        {
            title: "K-4 Skish",
            url: `contest/${Contests.Skish}`
        },
        {
            title: "K-5 Odległość spiningowa",
            url: `contest/${Contests.Distance}`
        },
        {
            title: "K-6 Odległość mucha oburącz",
            url: `contest/${Contests.FlyDistanceDoubleHand}`
        },
        {
            title: "K-7 Odległość spiningowa oburącz",
            url: `contest/${Contests.DistanceDoubleHand}`
        },
        {
            title: "K-8 Skish multi",
            url: `contest/${Contests.MultiSkish}`
        },
        {
            title: "K-9 Odległość multi",
            url: `contest/${Contests.MultiDistance}`
        }
    ],
},
{
    title: "Podsumowania",
    icon: TrophyIcon,
    tabs: [
        {
            title: "3-bój",
            url: `summary/${Thlon["3boj"].from}/${Thlon["3boj"].to}`
        },
        {
            title: "5-bój",
            url: `summary/${Thlon["5boj"].from}/${Thlon["5boj"].to}`
        },
        {
            title: "2-bój multi",
            url: `summary/${Thlon.multi.from}/${Thlon.multi.to}`
        },
        {
            title: "Drużynowe",
            url: 'teams/summary'
        }
    ],
}]



export const CompetitonContext = createContext<CompetitionContextProps>({
    contestants: [],
    teams: [],
    compInfo: {
        name: "",
        place: "",
        dateFrom: new Date(),
        dateTo: new Date(),
    },
    updateContestants: () => { },
    updateTeams: () => { },
    updateScores: () => { },
    setTab: () => { },
    loading: true,
});

export default function CompetitionLayout() {
    const data = useLoaderData<string>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("")
    const [loadingData, setLoadingData] = useState(true)
    const [rows, setRows] = React.useState<Array<Contestant & { isNew: boolean }>>([]);
    const [teams, setTeams] = React.useState<Array<Team & { isNew: boolean }>>([]);
    const [competition, setCompetition] = React.useState<Competition>({ id: "", name: "", place: "", dateFrom: new Date(), dateTo: new Date() });

    useEffect(() => {
        // Start update in background
        (async () => {
            try {
                await updateCompData(data, rows, teams);
            } catch (e) {
                console.error('Update failed:', e);
            }
        })();
    }, [rows, data, teams])

    const updateScores = React.useCallback((contestants: Array<Contestant>) => {
        if (loadingData) return;
        const localRows = [...rows];
        for (const contestant of contestants) {
            const row = localRows.find(r => r.id === contestant.id)
            if (!row) continue;
            row.contests = [...contestant.contests]
        }
        setRows([...localRows]);

        // Start update in background
        (async () => {
            try {
                await updateCompData(data, localRows, teams);
            } catch (e) {
                console.error('Update failed:', e);
            }
        })();
    }, [rows, data, loadingData, teams])

    useEffect(() => {
        async function fetchComp() {
            setLoadingData(true)
            const [compData, compInfo] = await Promise.all([getCompData(data), getCompetitionInfo(data)])
            if (!compInfo) return;
            setCompetition(compInfo)
            setRows(compData.contestants.map(x => ({ ...x, isNew: false })));
            setTeams(compData.teams.map(x => ({ ...x, isNew: false })));
            setLoadingData(false)
        }
        fetchComp()
    }, [data])


    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    {competition?.name}
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {items.map(item => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    style={{ fontWeight: 700 }}>
                                    <item.icon />
                                    {item.title}
                                </SidebarMenuButton>
                                <SidebarMenuSub>
                                    {item.tabs.map(tab => (
                                        <SidebarMenuSubItem key={tab.title} >
                                            <SidebarMenuSubButton onClick={() => {
                                                setActiveTab(tab.title)
                                                navigate(tab.url)
                                            }}
                                                style={{ minHeight: "fit-content" }}
                                                isActive={tab.title === activeTab}>{tab.title}
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>

                                    ))}
                                </SidebarMenuSub>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <Button variant={"outline"} onClick={() => navigate("/")}>
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

                <CompetitonContext.Provider value={{
                    compInfo: competition,
                    contestants: rows,
                    teams: teams,
                    loading: loadingData,
                    updateContestants: setRows,
                    updateTeams: setTeams,
                    updateScores: updateScores,
                    setTab: (tab) => {
                        const item = items.map(i => i.tabs.find(t => t.url === `contest/${tab}`))
                            .filter(Boolean)[0];
                        if (!item) return;
                        setActiveTab(item.title);
                    }
                }}>
                    <Outlet />
                </CompetitonContext.Provider>
            </SidebarInset>
        </SidebarProvider>
    )
}