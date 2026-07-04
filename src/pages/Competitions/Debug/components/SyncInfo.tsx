import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { usePrintSettings } from "@/context/printSettings/PrintSettingsContext";
import { getCompData } from "@/utils/jsonUtils";

export default function SyncInfo() {
    const { compInfo, syncToDb } = useCompetitionContext();
    const { showCreatorFooter, setShowCreatorFooter } = usePrintSettings();

    const handleDownload = async () => {
        const data = await getCompData(compInfo.id);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${compInfo.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Pobrano ${compInfo.id}.json`);
    };

    return (
        <>
            <div className="flex flex-col w-60 p-4 gap-2">
                <Button onClick={() => syncToDb()}>
                    Synchronizuj do bazy
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                    Pobierz plik zawodów
                </Button>
                <Button
                    variant={showCreatorFooter ? "default" : "outline"}
                    onClick={() => setShowCreatorFooter(!showCreatorFooter)}>
                    Stopka "Created by" {showCreatorFooter ? "włączona" : "wyłączona"}
                </Button>
                <span className="text-sm">
                    Ostatnia synchronizacja:<br /> {compInfo.lastSynced}
                </span>
            </div>
        </>
    );
}