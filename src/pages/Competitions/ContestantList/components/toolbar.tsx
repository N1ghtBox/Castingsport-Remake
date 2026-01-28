import { Button } from "@/components/ui/button";
import AddIcon from "@mui/icons-material/Add";
import {
	type GridRowId,
	GridRowModes,
	type GridRowModesModel,
	type GridRowsProp,
	type GridSlotProps,
	GridToolbarContainer,
} from "@mui/x-data-grid";
import { SaveIcon } from "lucide-react";
import { v7 as uuid } from "uuid";
import {
	Categories,
	type CategoryValues,
	type Contestant
} from "../../../../types/Contestant";
import { getDefaultContestList } from "./utils";

declare module "@mui/x-data-grid" {
	interface ToolbarPropsOverrides {
		setRows: (
			newRows: (
				oldRows: GridRowsProp<Contestant & { isNew: boolean }>,
			) => (Contestant & { isNew: boolean })[],
		) => void;
		setRowModesModel: (
			newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
		) => void;
		pendingRows: GridRowId[];
		saveChanges: (id: GridRowId) => () => void;
	}
}

export function EditToolbar(props: GridSlotProps["toolbar"]) {
	const { setRows, setRowModesModel } = props;

	const handleClick = () => {
		const id = uuid();

		const lastCategoryAdded = window.localStorage.getItem("lastCategoryAdded");

		const categoryToAdd =
			(lastCategoryAdded as CategoryValues) || Categories.Kadet;

		setRows((oldRows) => [
			{
				id,
				name: "",
				number: Math.max(...oldRows.map((x) => x.number), 0) + 1,
				category: categoryToAdd,
				club: "",
				contests: getDefaultContestList(false).map((x) => {
					return { ...x };
				}),
				girl: false,
				isNew: true,
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
		<GridToolbarContainer style={{ margin: 10, display: "flex" }}>
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
