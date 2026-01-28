import type { GridRowId, GridRowModesModel } from "@mui/x-data-grid";
import type { OptionalToolbar } from "@/components/Table/EditableTable.types";

export type EditableTableHookProps = Omit<
    EditableTableProps,
    | "rowModesModel"
    | "setRowModesModel"
> &
    OptionalToolbar;

export type EditableTableHookReturn = [
    EditableTableProps,
    {
        Params: EditableTableParams;
        Actions: EditableTableActions;
    },
];

type RowAction = (id: GridRowId) => () => void;

export type EditableTableProps = {
    rowModesModel: GridRowModesModel;
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
};

export type EditableTableParams = {
    pendingRows: string[];
};

export type EditableTableActions = {
    handleEditClick: RowAction;
    handleSaveClick: RowAction;
    handleDeleteClick: RowAction;
    handleCancelClick: RowAction;
};
