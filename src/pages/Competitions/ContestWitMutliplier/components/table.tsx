import { useLoaderData } from "react-router";
import EditableTable from "@/components/Table/EditableTable";
import { useContestEditableTable } from "@/hooks/useEditableTable";
import { getColumns } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const TableApi = useContestEditableTable();
	const contestId = Number.parseInt(useLoaderData());

	const columns = getColumns(TableApi, contestId);

	return (
		<EditableTable
			{...TableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
