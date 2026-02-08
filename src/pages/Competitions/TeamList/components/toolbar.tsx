import AddIcon from "@mui/icons-material/Add";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { v7 as uuid } from "uuid";
import SaveChangesButton from "@/components/SaveChangesButton";
import { Button } from "@/components/ui/button";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useEditableTableContext } from "@/context/editableTable/EditableTableContext";

export function EditToolbar() {
	const { Props, Actions, Params } = useEditableTableContext();
	const { updateTeams } = useCompetitionContext();

	const handleClick = () => {
		const id = uuid();

		updateTeams((oldRows) => [
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
		Props.setRowModesModel((oldModel) => ({
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
				pendingRows={Params.pendingRows}
				saveChanges={Actions.handleSaveClick}
			/>
		</GridToolbarContainer>
	);
}
