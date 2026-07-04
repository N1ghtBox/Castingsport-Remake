import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useColumns } from "@/consts/Columns";
import EditableTable from "@/components/Table/EditableTable";
import { useThlonContext } from "@/context/thlon/ThlonContext";
import { useThlonResultTable } from "@/hooks/useEditableTable/implementations/use-thlon-result-table";
import { useContestName } from "@/i18n/contestNames";
import { getColumn } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const { thlon: { from, to } } = useThlonContext()
	const tableApi = useThlonResultTable();
	const Cols = useColumns();
	const { t } = useTranslation();
	const getContestName = useContestName();

	const columns = useMemo(() => {
		return getColumn(from, to, Cols, t, getContestName);
	}, [from, to, Cols, t, getContestName]);

	return (
		<EditableTable
			{...tableApi}
			columns={columns}
			toolbar={EditToolbar}
		/>
	);
}
