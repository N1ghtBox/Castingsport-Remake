import type { GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useLoaderData } from "react-router";
import EditableTable from "@/components/Table/EditableTable";
import { EditableTableContext } from "@/components/Table/EditableTable.types";
import useEditableTable from "@/hooks/useEditableTable/use-editable-table";
import type { EditableContestant } from "../../../../types/Contestant";
import { getColumn } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const { from, to } = useLoaderData() as { from: number; to: number };
	const tableApi = useEditableTable(EditableTableContext.Contest);

	const columns: GridColDef<EditableContestant>[] = useMemo(() => {
		return getColumn(from, to);
	}, [from, to]);

	return (
		<EditableTable
			{...tableApi.Props}
			columns={columns}
			toolbar={() => EditToolbar()}
			toolbarProps={{}}
		/>
	);
}
