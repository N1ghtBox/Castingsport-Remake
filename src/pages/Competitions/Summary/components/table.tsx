import { useMemo } from "react";
import { useLoaderData } from "react-router";
import EditableTable from "@/components/Table/EditableTable";
import { useContestEditableTable } from "@/hooks/useEditableTable";
import { getColumn } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const { from, to } = useLoaderData() as { from: number; to: number };
	const tableApi = useContestEditableTable();

	const columns = useMemo(() => {
		return getColumn(from, to);
	}, [from, to]);

	return (
		<EditableTable
			{...tableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
