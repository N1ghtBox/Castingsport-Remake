import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import EditModeButton from "@/components/EditModeButton";
import SaveChangesButton from "@/components/SaveChangesButton";
import CategoryCombobox from "@/components/ui/CategoryCombobox";
import PrintButton from "@/components/ui/PrintButton";
import { useEditableTableContext } from "@/context/editableTable/EditableTableContext";

export function EditToolbar() {
	const { Params, Actions } = useEditableTableContext();
	const { t } = useTranslation();

	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<SaveChangesButton
				pendingRows={Params.pendingRows}
				saveChanges={Actions.handleSaveClick}
			/>
			<EditModeButton enterEditMode={Actions.enterEditMode} />
			<CategoryCombobox />
			<PrintButton />
			<GridToolbarQuickFilter style={{ marginLeft: "auto" }} placeholder={t("common.search")} />
		</GridToolbarContainer>
	);
}
