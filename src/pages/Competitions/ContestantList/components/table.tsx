import EditableTable from "@/components/Table/EditableTable";
import { useContestantEditableTable } from "@/hooks/useEditableTable";
import { getColumns } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const TableApi = useContestantEditableTable();

	const columns = getColumns(TableApi);

	return (
		<EditableTable
			{...TableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
