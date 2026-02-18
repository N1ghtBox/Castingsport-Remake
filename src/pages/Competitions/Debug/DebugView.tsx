import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Log = {
    type: string;
    data: string;
    message: string;
};

export default function DebugView() {
    const [logs, setLogs] = useState<Log[]>([]);

    const fetchLogs = useCallback(async () => {
        const rawLogs: string[] = await invoke("get_latest_logs");
        const logs: Log[] = rawLogs
            .map((log) => log.slice(1).split("] "))
            .map(([metaData, message]) => {
                const [type, date, hour] = metaData.split(" ");

                return {
                    id: uuid(),
                    type,
                    data: `${date} ${hour}`,
                    message,
                };
            })
            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        setLogs(logs);
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const columns: GridColDef<Log>[] = [
        {
            field: "type",
            headerName: "Typ",
            width: 100,
        },
        {
            field: "data",
            headerName: "Data",
            width: 200,
        },
        {
            field: "message",
            headerName: "Treść",
            width: 700,
        },
    ];

    return (
        <Tabs
            defaultValue="logs"
            className="w-full h-full">
            <TabsList variant="line">
                <TabsTrigger value="logs">Logi</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="logs">
                <DataGrid
                    rows={logs}
                    style={{ border: "none" }}
                    columns={columns}
                    editMode="row"
                    autoPageSize
                    hideFooterSelectedRowCount
                />
            </TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
    );
}
