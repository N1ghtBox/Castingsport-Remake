import { useLoaderData } from "react-router";
import EditableTable from "@/components/Table/EditableTable";
import { useContestEditableTable } from "@/hooks/useEditableTable";
import { getColumns } from "./column";
import { EditToolbar } from "./toolbar";

type Props = {
	contestMultiplier: number
}

export function Table({ contestMultiplier }: Props) {
	const TableApi = useContestEditableTable();

	const contestId = Number.parseInt(useLoaderData());

	const columns = getColumns(TableApi, contestId, contestMultiplier);

	return (
		<EditableTable
			{...TableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
