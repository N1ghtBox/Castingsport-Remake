import {
	type GridRowId,
	type GridSlotProps,
	GridToolbarContainer,
} from "@mui/x-data-grid";
import EditModeButton from "@/components/EditModeButton";
import SaveChangesButton from "@/components/SaveChangesButton";
import CategoryCombobox from "@/components/ui/CategoryCombobox";
import PrintButton from "@/components/ui/PrintButton";

declare module "@mui/x-data-grid" {
	interface ToolbarPropsOverrides {
		pendingRows: GridRowId[];
		saveChanges: (id: GridRowId) => () => void;
		enterEditMode?: () => void;
	}
}

export function EditToolbar(props: GridSlotProps["toolbar"]) {
	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<SaveChangesButton
				pendingRows={props.pendingRows}
				saveChanges={props.saveChanges}
			/>
			<CategoryCombobox />
			<PrintButton />
			<EditModeButton enterEditMode={props.enterEditMode} />
		</GridToolbarContainer>
	);
}
