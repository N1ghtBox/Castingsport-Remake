import AddIcon from "@mui/icons-material/Add";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { v7 as uuid } from "uuid";
import SaveChangesButton from "@/components/SaveChangesButton";
import { Button } from "@/components/ui/button";
import ProgramConsts from "@/consts/Consts";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useEditableTableContext } from "@/hooks/useEditableTable";
import { Categories, type CategoryValues } from "../../../../types/Contestant";
import { getDefaultContestList } from "../utils";

export function EditToolbar() {
	const tableContext = useEditableTableContext();
	const competitionContext = useCompetitionContext();

	const handleClick = () => {
		const id = uuid();

		const lastCategoryAdded = window.localStorage.getItem(
			ProgramConsts.Keys.LastSaveCategory,
		);

		const categoryToAdd =
			(lastCategoryAdded as CategoryValues) || Categories.Kadet;

		competitionContext.updateContestants((oldRows) => [
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
		tableContext.Props.setRowModesModel((oldModel) => ({
			...oldModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
		}));
	};
	return (
		<GridToolbarContainer style={{ margin: 10, display: "flex" }}>
			<Button
				color="primary"
				onClick={handleClick}>
				<AddIcon />
				Dodaj
			</Button>
			<SaveChangesButton
				pendingRows={tableContext.Params.pendingRows}
				saveChanges={tableContext.Actions.handleSaveClick}
			/>
		</GridToolbarContainer>
	);
}
