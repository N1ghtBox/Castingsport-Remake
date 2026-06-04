import { useColumns } from "@/consts/Columns";
import EditableTable from "@/components/Table/EditableTable";
import { useContestContext } from "@/context/contest/ContestContext";
import { useContestEditableTable } from "@/hooks/useEditableTable";
import { getColumns } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const TableApi = useContestEditableTable();
	const { contestId } = useContestContext();
	const Cols = useColumns();

	const columns = getColumns(TableApi, contestId, Cols);

	return (
		<EditableTable
			{...TableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
