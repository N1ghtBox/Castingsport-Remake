import { ChevronLeft } from "@mui/icons-material";
import { Sidebar, TrophyIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
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
import type { Item } from "@/layouts/competition/components/TabSelector.types";
import { PathProvider } from "@/providers/PathProvider/provider";
import { Thlon } from "@/types/Contestant";
import type { Series } from "@/types/Series";
import type { Action } from "@/utils/typeUtils";

type TabSelectorProps = {
    serie: Series;
    setActiveTab: Action<string>;
    activeTab: string;
};

const items: Array<Item> = [
    {
        title: "Podsumowania",
        icon: TrophyIcon,
        tabs: [
            {
                title: "5-bój",
                url: PathProvider.serie.summary(Thlon["5boj"]),
            },
            {
                title: "9-bój",
                url: PathProvider.serie.summary(Thlon["9boj"]),
            },
            {
                title: "2-bój multi",
                url: PathProvider.serie.summary(Thlon.multi),
            },
            {
                title: "2-bój odległościowy",
                url: PathProvider.serie.summary(Thlon.distance),
            },
            {
                title: "Drużynowe",
                url: PathProvider.serie.teams,
            },
        ],
    },
];

export default function TabSelector({
    serie,
    setActiveTab,
    activeTab,
}: TabSelectorProps) {
    const navigate = useNavigate();

    return (
        <Sidebar>
            <SidebarHeader>{serie.name}</SidebarHeader>
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
    );
}
