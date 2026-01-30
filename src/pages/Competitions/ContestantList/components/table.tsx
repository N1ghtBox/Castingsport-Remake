import type { GridColDef } from "@mui/x-data-grid";
import * as React from "react";
import EditableTable from "@/components/Table/EditableTable";
import { EditableTableContext } from "@/components/Table/EditableTable.types";
import useEditableTable from "@/hooks/useEditableTable/use-editable-table";
import { CompetitonContext } from "@/types/CompetitionContext";
import type { EditableContestant } from "../../../../types/Contestant";
import { getColumns } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const competition = React.useContext(CompetitonContext);
	const TableApi = useEditableTable(EditableTableContext.Competition);

	const columns: GridColDef<EditableContestant>[] = getColumns(TableApi);

	return (
		<EditableTable
			{...TableApi.Props}
			columns={columns}
			toolbar={(props) => EditToolbar(props)}
			toolbarProps={{
				setRows: competition.updateContestants,
				setRowModesModel: TableApi.Props.setRowModesModel,
				pendingRows: TableApi.Params.pendingRows,
				saveChanges: TableApi.Actions.handleSaveClick,
			}}
		/>
	);
}
