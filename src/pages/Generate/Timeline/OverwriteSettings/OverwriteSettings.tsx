import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type PlatformConfig from "@/types/PlatformConfig"
import type TimeConfig from "@/types/TimeConfig"
import { Settings2 } from "lucide-react"
import { useContext, useState } from "react"
import PlatfromForm from "./PlatformForm"
import TimeForm from "./TimeForm"
import { CompetitonContext } from "@/types/CompetitionContext"

type Settings = {
    platformConfig: PlatformConfig
    timeConfig: TimeConfig
}

const OverwriteSettings = () => {
    const competitionContext = useContext(CompetitonContext)
    const [newSettings, setNewSettings] = useState<Settings>({
        platformConfig: competitionContext.compInfo.platformConfig,
        timeConfig: competitionContext.compInfo.timeConfig
    })

    return <Dialog>
        <DialogTrigger asChild  >
            <Button variant={"outline"}><Settings2 />Ustawienia</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Ustawienia rozpiski</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="platforms">
                <TabsList>
                    <TabsTrigger value="platforms">Rzutnie</TabsTrigger>
                    <TabsTrigger value="times">Czasy konkurencji</TabsTrigger>
                </TabsList>
                <TabsContent value="platforms">
                    <PlatfromForm
                        config={newSettings.platformConfig}
                        updateConfig={(event, value) => {
                            setNewSettings(prev => ({ ...prev, platformConfig: { ...prev.platformConfig, [event]: value } }))
                        }} />
                </TabsContent>
                <TabsContent value="times">
                    <TimeForm
                        config={newSettings.timeConfig}
                        updateConfig={(event, value) => {
                            setNewSettings(prev => ({ ...prev, timeConfig: { ...prev.timeConfig, [event]: value } }))
                        }} />
                </TabsContent>
            </Tabs>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Anuluj</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button
                        type="submit"
                        onClick={() => competitionContext.updateConfig(newSettings)}>
                        Zapisz
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export default OverwriteSettings