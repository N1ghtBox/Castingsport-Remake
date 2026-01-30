import AddIcon from "@mui/icons-material/Add";
import {
	type GridRowId,
	GridRowModes,
	type GridRowModesModel,
	type GridRowsProp,
	type GridSlotProps,
	GridToolbarContainer,
} from "@mui/x-data-grid";
import { v7 as uuid } from "uuid";
import SaveChangesButton from "@/components/SaveChangesButton";
import { Button } from "@/components/ui/button";
import type Team from "@/types/Teams";

declare module "@mui/x-data-grid" {
	interface ToolbarPropsOverrides {
		setTeams: (
			newRows: (
				oldRows: GridRowsProp<Team & { isNew: boolean }>,
			) => (Team & { isNew: boolean })[],
		) => void;
		setRowModesModel: (
			newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
		) => void;
		pendingRows: GridRowId[];
		saveChanges: (id: GridRowId) => () => void;
	}
}

export function EditToolbar(props: GridSlotProps["toolbar"]) {
	const { setTeams, setRowModesModel } = props;

	const handleClick = () => {
		const id = uuid();

		setTeams((oldRows) => [
			{
				id,
				name: "",
				members: [],
				category: "Młodzieży",
				memberNames: [],
				isNew: false,
			},
			...oldRows,
		]);
		setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
		}));
	};

	return (
		<GridToolbarContainer style={{ margin: 10 }}>
			<Button
				color="primary"
				onClick={handleClick}>
				<AddIcon />
				Dodaj
			</Button>
			<SaveChangesButton
				pendingRows={props.pendingRows}
				saveChanges={props.saveChanges}
			/>
		</GridToolbarContainer>
	);
}
