import * as React from "react";
import { useLoaderData } from "react-router";
import EditableTable from "@/components/Table/EditableTable";
import { useContestEditableTable } from "@/hooks/useEditableTable";
import { ContestContext } from "@/types/ContestContext";
import { getColumns } from "./column";
import { EditToolbar } from "./toolbar";

export function Table() {
	const TableApi = useContestEditableTable();
	const contest = React.useContext(ContestContext);

	const contestId = Number.parseInt(useLoaderData());

	const columns = getColumns(
		TableApi,
		contestId,
		contest.contestMultiplier,
	);

	return (
		<EditableTable
			{...TableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
