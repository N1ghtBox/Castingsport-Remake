import type { GridValidRowModel } from "@mui/x-data-grid";
import type { EditableTableApi } from "@/hooks/useEditableTable/base/use-editable-table.types";

export type EditableTableContextApi<TModel extends GridValidRowModel> = {
	tableApi: EditableTableApi<TModel>;
};
