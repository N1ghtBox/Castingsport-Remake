import { useColumns } from "@/consts/Columns";
import EditableTable from "@/components/Table/EditableTable";
import { useContestContext } from "@/context/contest/ContestContext";
import { useContestEditableTable } from "@/hooks/useEditableTable";
import { getColumns } from "./column";
import { EditToolbar } from "./toolbar";

type Props = {
	contestMultiplier: number
}

export function Table({ contestMultiplier }: Props) {
	const TableApi = useContestEditableTable();
	const { contestId } = useContestContext();
	const Cols = useColumns();

	const columns = getColumns(TableApi, contestId, Cols, contestMultiplier);

	return (
		<EditableTable
			{...TableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
