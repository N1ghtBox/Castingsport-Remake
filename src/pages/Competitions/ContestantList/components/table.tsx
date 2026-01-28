import { ErrorInput } from "@/components/ErrorInput";
import EditableTable from "@/components/Table/EditableTable";
import useEditableTable from "@/hooks/useEditableTable/use-editable-table";
import { CompetitonContext } from "@/types/CompetitionContext";
import { TakesPartInThlon } from "@/utils/contestUtils";
import { renderCheckIcon } from "@/utils/renderUtils";
import { Face, Face3 } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
	GridActionsCellItem,
	type GridColDef,
	type GridPreProcessEditCellProps,
	type GridRowModel,
	GridRowModes,
} from "@mui/x-data-grid";
import * as React from "react";
import {
	Categories,
	type Contestant,
	type EditableContestant,
} from "../../../../types/Contestant";
import { EditToolbar } from "./toolbar";
import { contestSetter } from "./utils";

export function Table() {
	const competition = React.useContext(CompetitonContext);
	const [TableProps, { Actions, Params }] = useEditableTable();
	const [searchValue, setSearchValue] = React.useState("");

	const processRowUpdate = (newRow: GridRowModel<Contestant>) => {
		const updatedRow = { ...newRow, isNew: false };

		competition.updateContestants((prevRows) =>
			prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)),
		);
		window.localStorage.setItem("lastCategoryAdded", updatedRow.category);
		return updatedRow;
	};

	const columns: GridColDef<EditableContestant>[] = [
		{
			field: "number",
			headerName: "Nr. startowy",
			width: 50,
			editable: true,
			disableColumnMenu: true,
			renderEditCell: ErrorInput,
			valueParser: (value) => Number.parseInt(value) || 0,
			preProcessEditCellProps: (
				params: GridPreProcessEditCellProps<number, EditableContestant>,
			) => {
				if (
					!params.props.value ||
					Number.isNaN(params.props.value) ||
					params.props.value < 0
				) {
					return { ...params.props, error: "Nieprawidłowa wartość" };
				}

				if (
					competition.contestants.some(
						(x) => x.id !== params.row.id && x.number === params.props.value,
					)
				) {
					return {
						...params.props,
						error: `Numer startowy ${params.props.value} już istnieje`,
					};
				}
				return { ...params.props, error: false };
			},
		},
		{
			field: "name",
			headerName: "Imię i nazwisko",
			width: 180,
			editable: true,
			filterable: true,
		},
		{
			field: "club",
			headerName: "Klub",
			type: "string",
			width: 120,
			align: "left",
			headerAlign: "left",
			editable: true,
		},
		{
			field: "category",
			headerName: "Kategoria",
			width: 150,
			editable: true,
			type: "singleSelect",
			valueSetter: (val, row) => {
				if (val !== row.category) {
					row.category = val;
					processRowUpdate(row);
				}

				return row;
			},
			valueOptions: Object.values(Categories).filter((x) => x !== "Unknown"),
		},
		{
			field: "3boj",
			headerName: "3-bój",
			width: 100,
			type: "boolean",
			disableColumnMenu: true,
			valueGetter: (_, row) => {
				return TakesPartInThlon(row, "3boj");
			},
			valueSetter: contestSetter("3boj"),
			renderCell(params) {
				return renderCheckIcon(params.value);
			},
		},
		{
			field: "5boj",
			headerName: "5-bój",
			width: 100,
			editable: true,
			type: "boolean",
			disableColumnMenu: true,
			valueGetter: (_, row) => {
				return TakesPartInThlon(row, "5boj");
			},
			valueSetter: contestSetter("5boj"),
			renderCell(params) {
				return renderCheckIcon(params.value);
			},
		},
		{
			field: "multi",
			headerName: "2-bój multi",
			width: 100,
			editable: true,
			disableColumnMenu: true,

			type: "boolean",
			valueGetter: (_, row) => {
				return TakesPartInThlon(row, "multi");
			},
			valueSetter: contestSetter("multi"),
			renderCell(params) {
				return renderCheckIcon(params.value);
			},
		},
		{
			field: "distance",
			headerName: "2-bój odległościowy",
			width: 100,
			type: "boolean",
			editable: true,
			disableColumnMenu: true,

			valueGetter: (_, row) => {
				return TakesPartInThlon(row, "distance");
			},
			valueSetter: contestSetter("distance"),
			renderCell(params) {
				return renderCheckIcon(params.value);
			},
		},
		{
			field: "actions",
			type: "actions",
			headerName: "Akcje",
			width: 100,
			cellClassName: "actions",
			getActions: ({ id, row }) => {
				const isInEditMode =
					TableProps.rowModesModel[id]?.mode === GridRowModes.Edit;
				console.log(competition.contestants.find((x) => x.id === id));

				if (isInEditMode) {
					const action = [
						<GridActionsCellItem
							key={"saveAction"}
							icon={<SaveIcon />}
							label="Save"
							sx={{
								color: "primary.main",
							}}
							onClick={Actions.handleSaveClick(id)}
						/>,
						<GridActionsCellItem
							key={"cancelAction"}
							icon={<CancelIcon />}
							label="Cancel"
							className="textPrimary"
							onClick={Actions.handleCancelClick(id)}
							color="inherit"
						/>,
					];
					if (row.category === "Kadet") {
						action.unshift(
							<GridActionsCellItem
								key={"girlAction"}
								icon={row.girl ? <Face3 /> : <Face />}
								label="Kadetka"
								className="textPrimary"
								onClick={() => processRowUpdate({ ...row, girl: !row.girl })}
								color="inherit"
							/>,
						);
					}

					return action;
				}

				return [
					<GridActionsCellItem
						key={"editAction"}
						icon={<EditIcon />}
						label="Edit"
						className="textPrimary"
						onClick={Actions.handleEditClick(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						key={"deleteAction"}
						icon={<DeleteIcon />}
						label="Delete"
						onClick={Actions.handleDeleteClick(id)}
						color="inherit"
					/>,
				];
			},
		},
	];

	return (
		<EditableTable
			{...TableProps}
			columns={columns}
			searchValue={searchValue}
			toolbar={(props) => EditToolbar(props)}
			toolbarProps={{
				setRows: competition.updateContestants,
				setRowModesModel: TableProps.setRowModesModel,
				pendingRows: Params.pendingRows,
				saveChanges: Actions.handleSaveClick,
			}}
		/>
		// <DataGrid
		// 	rows={competition.contestants
		// 		.filter((x) => x.name.includes(searchValue))
		// 		.map((x) => {
		// 			return { ...x, isNew: false };
		// 		})}
		// 	style={{ border: "none" }}
		// 	columns={columns}
		// 	editMode="row"
		// 	autoPageSize
		// 	rowModesModel={rowModesModel}
		// 	onRowModesModelChange={handleRowModesModelChange}
		// 	onRowEditStop={handleRowEditStop}
		// 	processRowUpdate={processRowUpdate}
		// 	slots={{ toolbar: (props) => EditToolbar(props) }}
		// 	hideFooterSelectedRowCount
		// 	localeText={{
		// 		MuiTablePagination: {
		// 			labelDisplayedRows: (args) =>
		// 				`${args.from} - ${args.to} z ${args.count}`,
		// 		},
		// 	}}
		// 	slotProps={{
		// 		toolbar: {

		// 			setRows: competition.updateContestants,
		// 			setRowModesModel,
		// 			pendingRows: pendingRows,
		// 			saveChanges: handleSaveClick,
		// 			search: (value) => setSearchValue(value),
		// 		},
		// 	}}
		// />
	);
}
