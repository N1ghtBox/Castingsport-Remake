import type {
    DataGridProps,
    GridColDef,
    GridToolbarProps,
    GridValidRowModel,
    ToolbarPropsOverrides,
} from "@mui/x-data-grid";
import type { EditableTableApi } from "@/hooks/useEditableTable/base/use-editable-table.types";

export type Toolbar = {
    toolbar?: React.JSXElementConstructor<
        GridToolbarProps & ToolbarPropsOverrides
    >;
};

export type EditableTableComponentApiProps<TModel extends GridValidRowModel> =
    {
        Props: EditableTableApi<TModel>['Props'],
        Params: EditableTableApi<TModel>['Params'],
        Actions: EditableTableApi<TModel>['Actions'],

    }

export type EditableTableComponentUserProps<TModel extends GridValidRowModel> =
    {
        searchValue?: string;
        searchProperty?: "id" | "name" | "club";
        readonly columns: GridColDef<TModel>[];
    } & Toolbar & Partial<DataGridProps>;

export type EditableTableComponentProps<TModel extends GridValidRowModel> =
    EditableTableApi<TModel> & EditableTableComponentUserProps<TModel>;
