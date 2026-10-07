import type {
	GridRowId,
	GridRowModel,
	GridRowModesModel,
	GridValidRowModel,
} from "@mui/x-data-grid";

export type EditableTableApiProps<TModel> = {
	onSave?: RowModelAction<TModel>;
	onDelete?: RowAction;
	rows: TModel[];
	// When set, the table is read-only and this explains why.
	lockReason?: string;
};

export type EditableTableApi<
	TModel extends GridValidRowModel = GridValidRowModel,
> = {
	Props: EditableTableProps<TModel>;
	Params: EditableTableParams<TModel>;
	Actions: EditableTableActions;
};

export type EditableTableProps<TModel extends GridValidRowModel> = {
	processRowUpdate: (
		newRow: GridRowModel<TModel>,
		oldRow?: GridRowModel<TModel>,
	) => TModel | Promise<TModel>;
	rowModesModel: GridRowModesModel;
	setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>;
};

export type EditableTableParams<TModel extends GridValidRowModel> = {
	pendingRows: string[];
	rows: TModel[];
	lockReason?: string;
};

export type EditableTableActions = {
	handleEditClick: RowAction;
	handleSaveClick: RowAction;
	handleDeleteClick: RowAction;
	handleCancelClick: RowAction;
	enterEditMode: TableAction;
};

export type RowModelAction<TModel> = (updatedRow: TModel) => void;
export type RowAction = (id: GridRowId) => void;
export type TableAction = () => void;
