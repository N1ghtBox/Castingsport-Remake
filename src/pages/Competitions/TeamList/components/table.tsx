import { useColumns } from "@/consts/Columns";
import EditableTable from "@/components/Table/EditableTable";
import { useTeamEditableTable } from "@/hooks/useEditableTable";
import { useTranslation } from "react-i18next";
import { getColumn } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const tableApi = useTeamEditableTable();
	const Cols = useColumns();
	const { t } = useTranslation();

	const columns = getColumn(tableApi, Cols, t);

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
