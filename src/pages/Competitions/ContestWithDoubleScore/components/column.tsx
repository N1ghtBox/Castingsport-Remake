import type { GridColDef } from "@mui/x-data-grid";
import type { TableColumns } from "@/consts/Columns";
import type { EditableTableApi } from "@/hooks/useEditableTable/base/use-editable-table.types";
import type { EditableContestant } from "@/types/Contestant";

export const getColumns = (
    tableApi: EditableTableApi<EditableContestant>,
    contestId: number,
    Cols: TableColumns,
): GridColDef<EditableContestant>[] => {
    return [
        Cols.Display.NrStartowy,
        Cols.Display.Imie,
        Cols.Display.Klub,
        { ...Cols.Display.Kategoria, getApplyQuickFilterFn: () => null },
        { ...Cols.Actions.DoubleScore_Rzut1({ tableApi, contestId }), getApplyQuickFilterFn: () => null },
        { ...Cols.Actions.DoubleScore_Rzut2({ tableApi, contestId }), getApplyQuickFilterFn: () => null },
        Cols.Actions.Akcje({
            tableApi,
            actions: {
                Edit: true,
            },
        }),
    ];
};
