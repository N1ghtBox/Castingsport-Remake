import EditableTable from "@/components/Table/EditableTable";
import { useContestContext } from "@/context/contest/ContestContext";
import { useContestEditableTable } from "@/hooks/useEditableTable";
import { getColumns } from "./column";
import { EditToolbar } from "./toolbar";

export function Table() {
	const TableApi = useContestEditableTable();
	const { contestId } = useContestContext()

	const columns = getColumns(TableApi, contestId);

	return (
		<EditableTable
			{...TableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
