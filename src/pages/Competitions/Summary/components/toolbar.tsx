import { GridToolbarContainer } from "@mui/x-data-grid";
import PrintButton from "@/components/ui/PrintButton";
import ThlonCategoryCombobox from "@/components/ui/ThlonCategoryCombobox";

export function EditToolbar() {
	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<ThlonCategoryCombobox allowDeselect={false} />
			<PrintButton />
		</GridToolbarContainer>
	);
}
