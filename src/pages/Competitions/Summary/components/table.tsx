import { useMemo } from "react";
import EditableTable from "@/components/Table/EditableTable";
import { useThlonContext } from "@/context/thlon/ThlonContext";
import { useThlonResultTable } from "@/hooks/useEditableTable/implementations/use-thlon-result-table";
import { getColumn } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const { thlon: { from, to } } = useThlonContext()
	const tableApi = useThlonResultTable();

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
