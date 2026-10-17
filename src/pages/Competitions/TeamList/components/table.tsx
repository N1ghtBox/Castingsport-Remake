import { useColumns } from "@/consts/Columns";
import EditableTable from "@/components/Table/EditableTable";
import { useTeamEditableTable } from "@/hooks/useEditableTable";
import { useTranslation } from "react-i18next";
import { getColumn } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const { categoryFilter, setCategoryFilter, ...tableApi } =
		useTeamEditableTable();
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
			columns={columns}
			toolbar={EditToolbar}
			slotProps={{ toolbar: { categoryFilter, setCategoryFilter } }}
		/>
	);
}
