import type { GridColDef } from "@mui/x-data-grid";
import type { TableColumns } from "@/consts/Columns";
import type { EditableTableApi } from "@/hooks/useEditableTable/base/use-editable-table.types";
import type { EditableContestant } from "@/types/Contestant";

export const getColumns = (
    TableApi: EditableTableApi<EditableContestant>,
    Cols: TableColumns,
): GridColDef<EditableContestant>[] => {
    return [
        Cols.Actions.NrStartowy({ tableApi: TableApi }),
        Cols.Edit.Imie,
        Cols.Edit.Klub,
        { ...Cols.Actions.Kategoria({ tableApi: TableApi }), getApplyQuickFilterFn: () => null },
        { ...Cols.Actions.TakesPartIn({ tableApi: TableApi, thlon: "3boj" }), getApplyQuickFilterFn: () => null },
        { ...Cols.Actions.TakesPartIn({ tableApi: TableApi, thlon: "5boj" }), getApplyQuickFilterFn: () => null },
        { ...Cols.Actions.TakesPartIn({ tableApi: TableApi, thlon: "multi" }), getApplyQuickFilterFn: () => null },
        { ...Cols.Actions.TakesPartIn({ tableApi: TableApi, thlon: "distance" }), getApplyQuickFilterFn: () => null },
        Cols.Actions.Akcje({
            tableApi: TableApi,
            actions: {
                Edit: true,
                KadetToogle: true,
                Delete: true,
            },
        }),
    ];
};
