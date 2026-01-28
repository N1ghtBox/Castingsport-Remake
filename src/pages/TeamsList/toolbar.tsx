import {
	type GridRowId,
	GridRowModes,
	type GridRowModesModel,
	type GridRowsProp,
	type GridSlotProps,
	GridToolbarContainer,
} from "@mui/x-data-grid";
import type Team from "@/types/Teams";
import { v7 as uuid } from "uuid";
import { Button } from "../ui/button";
import AddIcon from "@mui/icons-material/Add";
import { SaveIcon } from "lucide-react";

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
				onClick={handleClick}>
				<AddIcon />
				Dodaj
			</Button>
			<Button
				color="primary"
				disabled={props.pendingRows.length === 0}
				onClick={saveAllPendingChanges}>
				<SaveIcon />
				Zapisz zmiany
			</Button>
		</GridToolbarContainer>
	);
}
