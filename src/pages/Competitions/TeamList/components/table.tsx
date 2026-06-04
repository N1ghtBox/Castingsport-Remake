import EditableTable from "@/components/Table/EditableTable";
import { useTeamEditableTable } from "@/hooks/useEditableTable";
import { getColumn } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const tableApi = useTeamEditableTable();

	const columns = getColumn(tableApi);

	return (
		<EditableTable
			{...tableApi}
			initialState={{
				columns: {
					columnVisibilityModel: {
						members: false,
					},
				},
			}}
			getRowHeight={() => "auto"}
			columns={columns}
			toolbar={EditToolbar}
			sx={{
				"& .MuiDataGrid-cell": {
					paddingTop: "4px",
					paddingBottom: "4px",
				},
			}}
		/>
	);
}
