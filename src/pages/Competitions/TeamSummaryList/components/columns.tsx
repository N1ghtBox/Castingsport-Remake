import type { GridColDef } from "@mui/x-data-grid";
import { TABLE_CONSTS } from "@/consts/TableConts";
import type { FinalScoreTeam } from "@/types/Teams";
import { sortByTotal } from "@/utils/sortUtils";

export const getColumns = (): GridColDef<FinalScoreTeam>[] => {
    return [
        {
            field: "place",
            headerName: "Miejsce",
            width: 90,
            renderCell: (params) => (
                <div className="h-full flex items-center">
                    <span>{params.value}</span>
                </div>
            ),
            ...TABLE_CONSTS.REMOVE_MENU,
        },
        {
            field: "name",
            headerName: "Nazwa",
            width: 90,
            renderCell: (params) => (
                <div className="h-full flex items-center">
                    <span>{params.value}</span>
                </div>
            ),
            ...TABLE_CONSTS.REMOVE_MENU,
        },
        {
            field: "members",
            headerName: "Zawodnicy",
            width: 300,
            renderCell: (params) => (
                <div className="flex flex-col">
                    {params.row.members.sort(sortByTotal).map((member) => (
                        <span
                            key={member.name}
                            className="flex justify-between">
                            <span>{member.name}</span>
                            <span>{member.total} pkt</span>
                        </span>
                    ))}
                </div>
            ),
            ...TABLE_CONSTS.REMOVE_MENU,
        },
        {
            field: "category",
            headerName: "Kategoria",
            renderCell: (params) => (
                <div className="h-full flex items-center">
                    <span>{params.value}</span>
                </div>
            ),
            ...TABLE_CONSTS.REMOVE_MENU,
        },
        {
            field: "total",
            headerName: "Razem",
            width: 100,
            renderCell: (params) => (
                <div className="h-full flex items-center">
                    <span>{params.value.toFixed(2)}</span>
                </div>
            ),
            ...TABLE_CONSTS.REMOVE_MENU,
        },
    ];
};
