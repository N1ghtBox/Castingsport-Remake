import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogTable from "./components/LogTable";
import SyncInfo from "./components/SyncInfo";

export default function DebugView() {


    return (
        <Tabs
            defaultValue="logs"
            className="w-full h-full">
            <TabsList variant="line">
                <TabsTrigger value="logs">Logi</TabsTrigger>
                <TabsTrigger value="sync">Synchronizacja</TabsTrigger>
            </TabsList>
            <TabsContent value="logs">
                <LogTable />
            </TabsContent>
            <TabsContent value="sync"><SyncInfo /></TabsContent>
        </Tabs>
    );
}
