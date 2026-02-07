import type { GridValidRowModel } from "@mui/x-data-grid";
import type { EditableTableApi } from "../base/use-editable-table.types";

export type EditableTableContextApi<TModel extends GridValidRowModel> = {
    tableApi: EditableTableApi<TModel>
}
