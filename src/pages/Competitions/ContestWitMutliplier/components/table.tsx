import type { GridColDef } from "@mui/x-data-grid";
import { useLoaderData } from "react-router";
import EditableTable from "@/components/Table/EditableTable";
import { EditableTableContext } from "@/components/Table/EditableTable.types";
import useEditableTable from "@/hooks/useEditableTable/use-editable-table";
import type { Contestant } from "@/types/Contestant";
import { getColumns } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const TableApi = useEditableTable(EditableTableContext.Contest);
	const contestId = Number.parseInt(useLoaderData());

	const columns: GridColDef<Contestant & { isNew: boolean }>[] = getColumns(
		TableApi,
		contestId,
	);

	return (
		<EditableTable
			{...TableApi.Props}
			columns={columns}
			toolbar={(props) => EditToolbar(props)}
			toolbarProps={{
				pendingRows: TableApi.Params.pendingRows,
				saveChanges: TableApi.Actions.handleSaveClick,
				enterEditMode: TableApi.Actions.enterEditMode,
			}}
		/>
	);
}
