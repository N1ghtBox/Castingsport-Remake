import type { GridColDef } from "@mui/x-data-grid";
import Columns from "@/consts/Columns";
import type { EditableTableApi } from "@/hooks/useEditableTable/base/use-editable-table.types";
import type { EditableContestant } from "@/types/Contestant";

export const getColumns = (
    tableApi: EditableTableApi<EditableContestant>,
    contestId: number,
): GridColDef<EditableContestant>[] => {
    return [
        Columns.Display.NrStartowy,
        Columns.Display.Imie,
        Columns.Display.Klub,
        { ...Columns.Display.Kategoria, getApplyQuickFilterFn: () => null },
        { ...Columns.Actions.DoubleScore_Rzut1({ tableApi, contestId }), getApplyQuickFilterFn: () => null },
        { ...Columns.Actions.DoubleScore_Rzut2({ tableApi, contestId }), getApplyQuickFilterFn: () => null },
        Columns.Actions.Akcje({
            tableApi,
            actions: {
                Edit: true,
            },
        }),
    ];
};
