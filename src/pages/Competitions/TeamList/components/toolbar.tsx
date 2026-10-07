import { Add } from "@mui/icons-material";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { v7 as uuid } from "uuid";
import { LockTooltip } from "@/components/LockTooltip";
import SaveChangesButton from "@/components/SaveChangesButton";
import { Button } from "@/components/ui/button";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useEditableTableContext } from "@/context/editableTable/EditableTableContext";

export function EditToolbar() {
	const { Props, Actions, Params } = useEditableTableContext();
	const { updateTeams } = useCompetitionContext();
	const { t } = useTranslation();

	const handleClick = () => {
		if (Params.lockReason) return;
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
			<LockTooltip reason={Params.lockReason}>
				<Button
					color="primary"
					disabled={!!Params.lockReason}
					onClick={handleClick}>
					<Add />
					{t("common.add")}
				</Button>
			</LockTooltip>
			<SaveChangesButton
				pendingRows={Params.pendingRows}
				saveChanges={Actions.handleSaveClick}
			/>
		</GridToolbarContainer>
	);
}
