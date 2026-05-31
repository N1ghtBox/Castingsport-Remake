import type { GridColDef } from "@mui/x-data-grid";
import Columns from "@/consts/Columns";
import type { EditableTableApi } from "@/hooks/useEditableTable/base/use-editable-table.types";
import type { EditableContestant } from "@/types/Contestant";

export const getColumns = (
    TableApi: EditableTableApi<EditableContestant>,
): GridColDef<EditableContestant>[] => {
    return [
        Columns.Actions.NrStartowy({ tableApi: TableApi }),
        Columns.Edit.Imie,
        Columns.Edit.Klub,
        { ...Columns.Actions.Kategoria({ tableApi: TableApi }), getApplyQuickFilterFn: () => null },
        { ...Columns.Actions.TakesPartIn({ tableApi: TableApi, thlon: "3boj" }), getApplyQuickFilterFn: () => null },
        { ...Columns.Actions.TakesPartIn({ tableApi: TableApi, thlon: "5boj" }), getApplyQuickFilterFn: () => null },
        { ...Columns.Actions.TakesPartIn({ tableApi: TableApi, thlon: "multi" }), getApplyQuickFilterFn: () => null },
        { ...Columns.Actions.TakesPartIn({ tableApi: TableApi, thlon: "distance" }), getApplyQuickFilterFn: () => null },
        Columns.Actions.Akcje({
            tableApi: TableApi,
            actions: {
                Edit: true,
                KadetToogle: true,
                Delete: true,
            },
        }),
    ];
};
