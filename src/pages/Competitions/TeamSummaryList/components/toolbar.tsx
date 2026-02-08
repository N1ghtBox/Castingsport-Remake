import { GridToolbarContainer } from "@mui/x-data-grid";
import TeamCategoryCombobox from "@/components/ui/TeamCategoryCombobox";
import TeamPrintButton from "@/components/ui/TeamPrintButton";

export function EditToolbar() {
	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<TeamCategoryCombobox />
			<TeamPrintButton />
		</GridToolbarContainer>
	);
}
