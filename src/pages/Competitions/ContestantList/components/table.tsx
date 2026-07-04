import { useColumns } from "@/consts/Columns";
import EditableTable from "@/components/Table/EditableTable";
import { useContestantEditableTable } from "@/hooks/useEditableTable";
import { getColumns } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const TableApi = useContestantEditableTable();
	const Cols = useColumns();

	const columns = getColumns(TableApi, Cols);

	return (
		<EditableTable
			{...TableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
