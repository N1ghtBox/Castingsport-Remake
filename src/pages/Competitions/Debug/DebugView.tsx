import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfigsPreview from "./components/ConfigsPreview";
import LogTable from "./components/LogTable";
import SyncInfo from "./components/SyncInfo";

export default function DebugView() {
    const { t } = useTranslation();

    return (
        <Tabs
            defaultValue="logs"
            className="w-full h-full">
            <TabsList variant="line">
                <TabsTrigger value="logs">{t("debug.logs")}</TabsTrigger>
                <TabsTrigger value="sync">{t("debug.sync")}</TabsTrigger>
                <TabsTrigger value="configs">{t("debug.configs")}</TabsTrigger>
            </TabsList>
            <TabsContent value="logs">
                <LogTable />
            </TabsContent>
            <TabsContent value="sync"><SyncInfo /></TabsContent>
            <TabsContent value="configs"><ConfigsPreview /></TabsContent>
        </Tabs>
    );
}
