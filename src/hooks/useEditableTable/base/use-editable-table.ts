import {
	type GridRowId,
	type GridRowModel,
	GridRowModes,
	type GridRowModesModel,
	type GridValidRowModel,
} from "@mui/x-data-grid";
import React from "react";
import ProgramConsts from "@/consts/Consts";
import type {
	EditableTableApi,
	EditableTableApiProps,
} from "./use-editable-table.types";

export const useEditableTable = <TModel extends GridValidRowModel>({
	onSave,
	onDelete,
	rows,
	lockReason,
}: EditableTableApiProps<TModel>): EditableTableApi<TModel> => {
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
		{},
	);

	const handleEditClick = (id: GridRowId) => {
		if (lockReason) return;
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.Edit },
		});
	};

	const handleSaveClick = (id: GridRowId) => {
		setRowModesModel((prevModel) => ({
			...prevModel,
			[id]: { mode: GridRowModes.View },
		}));
	};

	const handleDeleteClick = (id: GridRowId) => {
		if (lockReason) return;
		onDelete?.(id);
	};

	const handleCancelClick = (id: GridRowId) => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});
	};

	const enterEditMode = () => {
		if (lockReason) return;
		setRowModesModel(
			rows.reduce((acc, row) => {
				acc[row.id] = { mode: GridRowModes.Edit };
				return acc;
			}, {} as GridRowModesModel),
		);
	};

	const pendingRows = React.useMemo(() => {
		return Object.entries(rowModesModel)
			.filter(([_, value]) => value.mode === GridRowModes.Edit)
			.map(([key]) => key);
	}, [rowModesModel]);

	const processRowUpdate = (newRow: GridRowModel<TModel>) => {
		const updatedRow = { ...newRow, isNew: false };

		onSave?.(updatedRow);

		if (updatedRow.category)
			window.localStorage.setItem(ProgramConsts.Keys.LastSaveCategory, updatedRow.category);

		return updatedRow;
	};

	return {
		Props: {
			processRowUpdate,
			rowModesModel,
			setRowModesModel,
		},
		Params: {
			pendingRows,
			rows: rows,
			lockReason,
		},
		Actions: {
			handleCancelClick,
			handleSaveClick,
			handleEditClick,
			handleDeleteClick,
			enterEditMode,
		},
	};
};
