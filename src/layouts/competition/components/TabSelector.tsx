import { ChevronLeft, Construction } from "@mui/icons-material";
import { ListIcon, TrophyIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import type Competition from "@/types/Competition";
import { Contests, Thlon } from "@/types/Contestant";
import type { Action } from "@/utils/typeUtils";
import type { Item } from "./TabSelector.types";

export const items: Array<Item> = [
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

type TabSelectorProps = {
    competition: Competition | undefined;
    setActiveTab: Action<string>;
    activeTab: string;
};

export default function TabSelector({
    competition,
    setActiveTab,
    activeTab
}: TabSelectorProps) {
    const navigate = useNavigate();

    return (
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
    );
}
