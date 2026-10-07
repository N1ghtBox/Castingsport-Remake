import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useColumns } from "@/consts/Columns";
import EditableTable from "@/components/Table/EditableTable";
import { useContestantEditableTable } from "@/hooks/useEditableTable";
import { getColumns } from "./columns";
import { EditToolbar } from "./toolbar";

export function Table() {
	const {
		numberConflict,
		resolveNumberConflict,
		pendingDelete,
		resolveDelete,
		...TableApi
	} = useContestantEditableTable();
	const Cols = useColumns();
	const { t } = useTranslation();

	const columns = getColumns(TableApi, Cols);

	return (
		<>
			<EditableTable
				{...TableApi}
				columns={columns}
				toolbar={EditToolbar}
			/>
			<ConfirmDialog
				open={numberConflict !== undefined}
				title={t("dialog.startNumberTakenTitle", { number: numberConflict })}
				description={t("dialog.startNumberTakenDescription", { number: numberConflict })}
				confirmLabel={t("dialog.insertAndShift")}
				onResolve={resolveNumberConflict}
			/>
			<ConfirmDialog
				open={pendingDelete !== undefined}
				title={t("dialog.deleteContestantTitle", {
					name: pendingDelete?.name || `#${pendingDelete?.number}`,
				})}
				description={t("dialog.deleteContestantDescription", {
					number: pendingDelete?.number,
				})}
				confirmLabel={t("common.delete")}
				destructive
				onResolve={resolveDelete}
			/>
		</>
	);
}
