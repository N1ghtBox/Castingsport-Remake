import { GridToolbarContainer } from "@mui/x-data-grid";
import EditModeButton from "@/components/EditModeButton";
import SaveChangesButton from "@/components/SaveChangesButton";
import CategoryCombobox from "@/components/ui/CategoryCombobox";
import PrintButton from "@/components/ui/PrintButton";
import { useEditableTableContext } from "@/hooks/useEditableTable";

export function EditToolbar() {
	const { Params, Actions } = useEditableTableContext();

	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<SaveChangesButton
				pendingRows={Params.pendingRows}
				saveChanges={Actions.handleSaveClick}
			/>
			<CategoryCombobox />
			<PrintButton />
			<EditModeButton enterEditMode={Actions.enterEditMode} />
		</GridToolbarContainer>
	);
}
