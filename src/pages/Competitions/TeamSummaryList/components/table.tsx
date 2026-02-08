import EditableTable from "@/components/Table/EditableTable";
import { useTeamSummaryTable } from "@/hooks/useEditableTable/implementations/use-team-summary-table";
import { getColumns } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const tableApi = useTeamSummaryTable();

	const columns = getColumns();

	return (
		<EditableTable
			{...tableApi}
			columns={columns}
			getRowHeight={() => "auto"}
			toolbar={EditToolbar}
		/>
	);
}
