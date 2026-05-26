import { Button } from "@/components/ui/button";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";



export default function SyncInfo() {
    const { compInfo: { lastSynced }, syncToDb } = useCompetitionContext()




    return (
        <>
            <div className="flex flex-col w-60 p-4">
                <Button onClick={() => syncToDb()}>
                    Synchronizuj do bazy
                </Button>
                <span className="text-sm">

                    Ostatnia synchronizacja:<br /> {lastSynced}
                </span>
            </div>
        </>
    )
}