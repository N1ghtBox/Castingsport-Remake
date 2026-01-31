import * as React from "react";
import { useLoaderData } from "react-router";
import EditableTable from "@/components/Table/EditableTable";
import { EditableTableContext } from "@/components/Table/EditableTable.types";
import useEditableTable from "@/hooks/useEditableTable/use-editable-table";
import { ContestContext } from "@/types/ContestContext";
import { getColumns } from "./column";
import { EditToolbar } from "./toolbar";

export function Table() {
	const TableApi = useEditableTable(EditableTableContext.Contest);
	const contest = React.useContext(ContestContext);

	const contestId = Number.parseInt(useLoaderData());

	const columns = getColumns(
		TableApi,
		contestId,
		contest.contestMultiplier || 1,
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
