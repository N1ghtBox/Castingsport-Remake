import {
	GridToolbarContainer
} from "@mui/x-data-grid";
import SerieCategoryCombobox from "../SerieCategoryCombobox";

declare module "@mui/x-data-grid" {
	interface ToolbarPropsOverrides {

	}
}

export function EditToolbar() {

	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<SerieCategoryCombobox />
		</GridToolbarContainer>
	);
}
