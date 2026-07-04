import { ChevronLeft, Construction } from "@mui/icons-material";
import { ChevronDown, ListIcon, TrophyIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import type { Competition } from "@/types/Competition";
import { Contests, Thlon } from "@/types/Contestant";
import type { Action } from "@/utils/typeUtils";
import type { Item } from "./TabSelector.types";

export function useNavItems(): Array<Item> {
    const { t } = useTranslation();
    return [
        {
            title: t("nav.lists"),
            icon: ListIcon,
            tabs: [
                { title: t("nav.contestants"), url: "contestants" },
                { title: t("nav.teams"), url: "teams" },
            ],
        },
        {
            title: t("nav.contests"),
            icon: TrophyIcon,
            tabs: [
                { title: t("tabs.k1"), url: `contest/${Contests.FlySkish}` },
                { title: t("tabs.k2"), url: `contest/${Contests.FlyDistance}` },
                { title: t("tabs.k3"), url: `contest/${Contests.Arenberg}` },
                { title: t("tabs.k4"), url: `contest/${Contests.Skish}` },
                { title: t("tabs.k5"), url: `contest/${Contests.Distance}` },
                { title: t("tabs.k6"), url: `contest/${Contests.FlyDistanceDoubleHand}` },
                { title: t("tabs.k7"), url: `contest/${Contests.DistanceDoubleHand}` },
                { title: t("tabs.k8"), url: `contest/${Contests.MultiSkish}` },
                { title: t("tabs.k9"), url: `contest/${Contests.MultiDistance}` },
            ],
        },
        {
            title: t("nav.summaries"),
            icon: TrophyIcon,
            tabs: [
                { title: t("tabs.thlon3"), url: `summary/${Thlon["3boj"].from}/${Thlon["3boj"].to}` },
                { title: t("tabs.thlon5"), url: `summary/${Thlon["5boj"].from}/${Thlon["5boj"].to}` },
                { title: t("tabs.thlon9"), url: `summary/${Thlon["9boj"].from}/${Thlon["9boj"].to}` },
                { title: t("tabs.thlonMulti"), url: `summary/${Thlon.multi.from}/${Thlon.multi.to}` },
                { title: t("tabs.thlonDistance"), url: `summary/${Thlon.distance.from}/${Thlon.distance.to}` },
                { title: t("nav.teamSummary"), url: "teams/summary" },
            ],
        },
    ];
}

export const items: Array<Item> = [
    {
        title: "Listy",
        icon: ListIcon,
        tabs: [
            { title: "Zawodnicy", url: "contestants" },
            { title: "Drużyny", url: "teams" },
        ],
    },
    {
        title: "Konkurencje",
        icon: TrophyIcon,
        tabs: [
            { title: "K-1 Mucha cel", url: `contest/${Contests.FlySkish}` },
            { title: "K-2 Mucha odległość", url: `contest/${Contests.FlyDistance}` },
            { title: "K-3 Arenberg", url: `contest/${Contests.Arenberg}` },
            { title: "K-4 Skish", url: `contest/${Contests.Skish}` },
            { title: "K-5 Odległość spiningowa", url: `contest/${Contests.Distance}` },
            { title: "K-6 Odległość mucha oburącz", url: `contest/${Contests.FlyDistanceDoubleHand}` },
            { title: "K-7 Odległość spiningowa oburącz", url: `contest/${Contests.DistanceDoubleHand}` },
            { title: "K-8 Skish multi", url: `contest/${Contests.MultiSkish}` },
            { title: "K-9 Odległość multi", url: `contest/${Contests.MultiDistance}` },
        ],
    },
    {
        title: "Podsumowania",
        icon: TrophyIcon,
        tabs: [
            { title: "3-bój", url: `summary/${Thlon["3boj"].from}/${Thlon["3boj"].to}` },
            { title: "5-bój", url: `summary/${Thlon["5boj"].from}/${Thlon["5boj"].to}` },
            { title: "9-bój", url: `summary/${Thlon["9boj"].from}/${Thlon["9boj"].to}` },
            { title: "2-bój multi", url: `summary/${Thlon.multi.from}/${Thlon.multi.to}` },
            { title: "2-bój odległościowy", url: `summary/${Thlon.distance.from}/${Thlon.distance.to}` },
            { title: "Drużynowe", url: "teams/summary" },
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
    const { t } = useTranslation();
    const navItems = useNavItems();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
        () => Object.fromEntries(navItems.map((item) => [item.title, true]))
    );

    return (
        <Sidebar>
            <SidebarHeader className="h-[fit]">{competition?.name}</SidebarHeader>
            <SidebarContent>
                <ScrollArea className="h-full w-full">
                    <SidebarMenu>
                        <SidebarMenuItem key={"tools"}>
                            <SidebarMenuButton
                                onClick={() => {
                                    setActiveTab(t("nav.tools"));
                                    navigate("");
                                }}
                                style={{ minHeight: "fit-content" }}
                                isActive={activeTab === t("nav.tools") || activeTab === "Narzędzia"}>
                                <Construction />
                                {t("nav.tools")}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        {navItems.map((item) => (
                            <Collapsible
                                className="w-full"
                                key={item.title}
                                open={openGroups[item.title] ?? true}
                                onOpenChange={(open) =>
                                    setOpenGroups((prev) => ({ ...prev, [item.title]: open }))
                                }>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton style={{ fontWeight: 700 }}>
                                            <item.icon />
                                            {item.title}
                                            <ChevronDown
                                                className="ml-auto transition-transform duration-200"
                                                style={{
                                                    transform: (openGroups[item.title] ?? true) ? "rotate(180deg)" : "rotate(0deg)",
                                                }}
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.tabs.map((tab) => (
                                                <SidebarMenuSubItem key={tab.url}>
                                                    <SidebarMenuSubButton
                                                        onClick={() => {
                                                            setActiveTab(tab.title);
                                                            navigate(tab.url);
                                                        }}
                                                        style={{ minHeight: "fit-content", userSelect: "none" }}
                                                        isActive={tab.title === activeTab}>
                                                        {tab.title}
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter className="h-[8%]">
                <Button
                    variant={"outline"}
                    onClick={() => navigate("/")}>
                    <ChevronLeft />
                    {t("common.return")}
                </Button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
