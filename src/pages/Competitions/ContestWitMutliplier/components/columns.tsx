import type { GridColDef } from "@mui/x-data-grid";
import Columns from "@/consts/Columns";
import type { EditableTableApi } from "@/hooks/useEditableTable/use-editable-table.types";
import type { EditableContestant } from "@/types/Contestant";

export const getColumns = (
    tableApi: EditableTableApi,
    contestId: number,
): GridColDef<EditableContestant>[] => {
    return [
        Columns.Display.NrStartowy,
        Columns.Display.Imie,
        Columns.Display.Klub,
        Columns.Display.Kategoria,
        Columns.Actions.ScoreWithMultiplier_Score({ tableApi, contestId }),
        Columns.Actions.ScoreWithMultiplier_MultipliedScore({ tableApi, contestId }),
        Columns.Actions.Akcje({
            tableApi,
            actions: {
                Edit: true,
            },
        }),
    ];
};
