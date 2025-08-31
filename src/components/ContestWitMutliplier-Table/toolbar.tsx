import SaveIcon from "@mui/icons-material/Save";
import {
	type GridRowId,
	type GridSlotProps,
	GridToolbarContainer,
} from "@mui/x-data-grid";
import CategoryCombobox from "../ui/CategoryCombobox";
import PrintButton from "../ui/PrintButton";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EditIcon } from "lucide-react";
import { CompetitonContext } from "@/types/CompetitionContext";
import { useContext } from "react";

declare module "@mui/x-data-grid" {
	interface ToolbarPropsOverrides {
		pendingRows: GridRowId[];
		saveChanges: (id: GridRowId) => () => void;
		search?: (searchValue: string) => void;
		enterEditMode?: () => void;
	}
}

export function EditToolbar(props: GridSlotProps["toolbar"]) {
		const { searchValue, setSearchValue } = useContext(CompetitonContext)
	const saveAllPendingChanges = () => {
		for (let i = 0; i < props.pendingRows.length; i++) {
			const element = props.pendingRows[i];
			props.saveChanges(element)();
		}
	};

	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<Button
				color="primary"
				disabled={props.pendingRows.length === 0}
				onClick={saveAllPendingChanges}>
				<SaveIcon />
				Zapisz zmiany
			</Button>
			{props.search && (
				<Input onChange={(e) => props.search?.(e.target.value)} />
			)}

			<CategoryCombobox />
			<Input className="w-60" placeholder="Wyszukaj..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
			<PrintButton />

			<Button
				color="primary"
				onClick={props.enterEditMode}>
				<EditIcon />
				Tryb edycji
			</Button>
		</GridToolbarContainer>
	);
}
