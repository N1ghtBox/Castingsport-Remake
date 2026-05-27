import { MedalIcon, TrophyIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import ProgramConsts from "@/consts/Consts";
import type { Competition } from "@/types/Competition";

type TabSelectorProps = {
    competitions: Competition[];
};

export default function TabSelector({ competitions }: TabSelectorProps) {
    const [activeTab, setActiveTab] = useState<string>("");
    const navigate = useNavigate();

    const changeActiveTab = (tab: string) => {
        navigate(tab);
        setActiveTab(tab);
        window.localStorage.setItem(ProgramConsts.Keys.LastActiveTab, tab);
    };

    const competitionYears = useMemo(() => {
        const years = new Set([
            ...competitions.map((x) => new Date(x.dateFrom).getFullYear()),
            new Date().getFullYear(),
        ]);
        return Array.from(years).sort((a, b) => a - b);
    }, [competitions]);

    useEffect(() => {
        const lastActiveTab = window.localStorage.getItem(ProgramConsts.Keys.LastActiveTab)

        if (lastActiveTab) {
            changeActiveTab(lastActiveTab);
        }
    }, [])

    return (
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
                                                    changeActiveTab(`competitions/${year}`);
                                                }}
                                                isActive={activeTab === `competitions/${year}`}>
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
                                                    changeActiveTab(`series/${year}`);
                                                }}
                                                isActive={activeTab === `series/${year}`}>
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
    );
}
