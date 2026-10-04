import { useColumns } from "@/consts/Columns";
import EditableTable from "@/components/Table/EditableTable";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useContestantEditableTable } from "@/hooks/useEditableTable";
import { getColumns } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const TableApi = useContestantEditableTable();
	const Cols = useColumns();
	const { compInfo } = useCompetitionContext();

	const columns = getColumns(TableApi, Cols, compInfo.subcategories, compInfo.isInternational);

	return (
		<EditableTable
			{...TableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
