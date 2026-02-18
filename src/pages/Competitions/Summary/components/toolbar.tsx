import { GridToolbarContainer } from "@mui/x-data-grid";
import ThlonPrintButton from "@/components/ui/ResultsPrintButton";
import ThlonCategoryCombobox from "@/components/ui/ThlonCategoryCombobox";

export function EditToolbar() {
	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<ThlonCategoryCombobox allowDeselect={false} />
			<ThlonPrintButton />
		</GridToolbarContainer>
	);
}
