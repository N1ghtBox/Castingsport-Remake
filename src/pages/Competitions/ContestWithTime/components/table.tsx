import { useLoaderData } from "react-router";
import EditableTable from "@/components/Table/EditableTable";
import { useContestContext } from "@/context/contest/ContestContext";
import { useContestEditableTable } from "@/hooks/useEditableTable";
import { getColumns } from "./column";
import { EditToolbar } from "./toolbar";

export function Table() {
	const TableApi = useContestEditableTable();
	const { contestMultiplier } = useContestContext();

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
