import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, useNavigate } from "react-router";
import { Separator } from "./components/ui/separator";
import { TrophyIcon } from "lucide-react";
import { createContext, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import CompetitionForm from "./components/ui/comp-form";
import AddIcon from '@mui/icons-material/Add';
import { Button } from "./components/ui/button";
import { toast } from "sonner";
import type Competition from "./types/Competition";
import { getGeneralData } from "./utils/jsonUtils";
import type { CompetitionListContextProps } from "./types/CompetitionListContext";

export const CompetitonListContext = createContext<CompetitionListContextProps>({
    competitions: []
});

export default function Layout() {
    const [activeTab, setActiveTab] = useState<string>("")
    const navigate = useNavigate()
    const [competitions, setCompetitions] = useState<Array<Competition>>([])

    useEffect(() => {
        async function fetchCompetitions() {
            try {
                const json = await getGeneralData();
                setCompetitions(json.competitions)
            } catch {
                toast.error("Nie udało się zaczytać danych")
            }
        }

        fetchCompetitions()
    }, [])

    function AfterCreate(id: string) {
        navigate(`/competition/${id}`)
    }

    const competitionYears = useMemo(() => {
        const years = new Set([...competitions
            .map(x => new Date(x.dateFrom).getFullYear()),
        new Date().getFullYear()])
        return [...years].sort((a, b) => a - b)
    }, [competitions])

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Zestawy</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem key={"Zawody"}>
                                    <SidebarMenuButton
                                        style={{ fontWeight: 700 }}>
                                        <TrophyIcon />
                                        Zawody
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        {competitionYears.map(year => (
                                            <SidebarMenuSubItem key={year}>
                                                <SidebarMenuSubButton onClick={() => {
                                                    navigate(`competitions/${year}`)
                                                    setActiveTab(`comp-${year}`)
                                                }}
                                                    isActive={activeTab === `comp-${year}`}>
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
                <span className="m-[12px] flex gap-1.5">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button color="primary">
                                <AddIcon />
                                Dodaj
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Utwórz zawody</DialogTitle>
                            </DialogHeader>
                            <CompetitionForm callback={AfterCreate} />
                        </DialogContent>
                    </Dialog>
                </span>
                <CompetitonListContext.Provider value={{ competitions: competitions }}>
                    <Outlet />
                </CompetitonListContext.Provider>
            </SidebarInset>
        </SidebarProvider>
    )
}