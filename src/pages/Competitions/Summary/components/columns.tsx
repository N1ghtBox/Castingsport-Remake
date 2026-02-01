import type { GridColDef } from "@mui/x-data-grid";
import Columns from "@/consts/Columns";
import { TABLE_CONSTS } from "@/consts/TableConts";
import { ContestNames, type EditableContestant } from "@/types/Contestant";
import { RenderContestScore } from "@/utils/renderUtils";

export const getColumn = (
    from: number,
    to: number,
): GridColDef<EditableContestant>[] => {
    return [
        Columns.Display.Miejsce,
        Columns.Display.NrStartowy,
        Columns.Display.Imie,
        Columns.Display.Klub,
        Columns.Display.Kategoria,
        ...Array.from({ length: to - from + 1 }, (_, i) => i + from).map(
            (contestId) =>
                ({
                    field: `score${contestId + from}`,
                    headerName: ContestNames.get(contestId),
                    width: 120,
                    ...TABLE_CONSTS.REMOVE_MENU,
                    renderCell: (params) => (
                        <span>{RenderContestScore(contestId, params.row)}</span>
                    ),
                }) as GridColDef<EditableContestant>,
        ),
        {
            field: "total",
            headerName: "Razem",
            width: 100,
            renderCell: (params) => <span>{params.value.toFixed(2)}</span>,
            ...TABLE_CONSTS.REMOVE_MENU,
        },
    ];
};
