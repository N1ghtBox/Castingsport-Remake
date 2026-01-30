import type { GridRowId, GridRowModel, GridRowModesModel } from "@mui/x-data-grid";
import type {
    EditableTableComponentProps,
    OptionalToolbar,
} from "@/components/Table/EditableTable.types";
import type { EditableContestant } from "@/types/Contestant";

export type EditableTableHookProps = Omit<
    EditableTableProps,
    "rowModesModel" | "setRowModesModel"
> &
    OptionalToolbar;

export type EditableTableApi = {
    Props: EditableTableProps;
    Params: EditableTableParams;
    Actions: EditableTableActions;
};

export type RowAction = (id: GridRowId) => () => void;
export type TableAction = () => void;

export type EditableTableProps = {
    processRowUpdate: (newRow: GridRowModel<EditableContestant>) => EditableContestant
    context: EditableTableComponentProps["context"];
    rowModesModel: GridRowModesModel;
    setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
};

export type EditableTableParams = {
    pendingRows: string[];
    rows: EditableContestant[];
};

export type EditableTableActions = {
    handleEditClick: RowAction;
    handleSaveClick: RowAction;
    handleDeleteClick: RowAction;
    handleCancelClick: RowAction;
    enterEditMode: TableAction;
};
