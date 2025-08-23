import {
	GridToolbarContainer
} from "@mui/x-data-grid";
import SerieTeamCategoryCombobox from "../SerieTeamCategoryCombobox";

declare module "@mui/x-data-grid" {
	interface ToolbarPropsOverrides {

	}
}

export function EditToolbar() {

	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<SerieTeamCategoryCombobox />
		</GridToolbarContainer>
	);
}
