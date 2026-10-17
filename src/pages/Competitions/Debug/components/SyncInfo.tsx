import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { usePrintSettings } from "@/context/printSettings/PrintSettingsContext";
import { getCompExportData } from "@/utils/jsonUtils";

export default function SyncInfo() {
    const { compInfo, syncToDb } = useCompetitionContext();
    const { showCreatorFooter, setShowCreatorFooter } = usePrintSettings();
    const { t } = useTranslation();
    const [syncDialogOpen, setSyncDialogOpen] = useState(false);

    const sync = (debugOnly: boolean) => {
        setSyncDialogOpen(false);
        syncToDb({ ignoreStatus: true, debugOnly });
    };

    const handleDownload = async () => {
        const data = await getCompExportData(compInfo.id);
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
                <Button onClick={() => setSyncDialogOpen(true)}>
                    {t("debug.syncToDb")}
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                    {t("debug.downloadFile")}
                </Button>
                <Button
                    variant={showCreatorFooter ? "default" : "outline"}
                    onClick={() => setShowCreatorFooter(!showCreatorFooter)}>
                    {showCreatorFooter ? t("debug.creatorFooterOn") : t("debug.creatorFooterOff")}
                </Button>
                <span className="text-sm">
                    {t("debug.lastSync")}<br /> {compInfo.lastSynced}
                </span>
            </div>
            <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("debug.syncModeTitle")}</DialogTitle>
                        <DialogDescription>{t("debug.syncModeDescription")}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSyncDialogOpen(false)}>
                            {t("common.cancel")}
                        </Button>
                        <Button variant="secondary" onClick={() => sync(true)}>
                            {t("debug.syncDebug")}
                        </Button>
                        <Button autoFocus onClick={() => sync(false)}>
                            {t("debug.syncNormal")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
