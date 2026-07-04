import type { GridColDef } from "@mui/x-data-grid";
import type { TFunction } from "i18next";
import type { TableColumns } from "@/consts/Columns";
import { TABLE_CONSTS } from "@/consts/TableConts";
import type { Contests, ContestWithResults } from "@/types/Contestant";
import { RenderContestScore } from "@/utils/renderUtils";

export const getColumn = (
    from: number,
    to: number,
    Cols: TableColumns,
    t: TFunction,
    getContestName: (contest: Contests) => string,
): GridColDef<ContestWithResults>[] => {
    return [
        Cols.Display.Miejsce,
        Cols.Display.NrStartowy,
        Cols.Display.Imie,
        Cols.Display.Klub,
        Cols.Display.Kategoria,
        ...Array.from({ length: to - from + 1 }, (_, i) => i + from).map(
            (contestId) =>
                ({
                    field: `score${contestId + from}`,
                    headerName: getContestName(contestId as Contests),
                    width: 120,
                    ...TABLE_CONSTS.REMOVE_MENU,
                    renderCell: (params) => (
                        <span>{RenderContestScore(contestId, params.row)}</span>
                    ),
                }) as GridColDef<ContestWithResults>,
        ),
        {
            field: "total",
            headerName: t("table.total"),
            width: 100,
            renderCell: (params) => <span>{params.value.toFixed(2)}</span>,
            ...TABLE_CONSTS.REMOVE_MENU,
        },
    ];
};
