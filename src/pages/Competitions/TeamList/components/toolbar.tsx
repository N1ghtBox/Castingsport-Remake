import { Add } from "@mui/icons-material";
import { GridRowModes, GridToolbarContainer, type GridToolbarProps, type ToolbarPropsOverrides } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { v7 as uuid } from "uuid";
import { Combobox } from "@/components/Combobox";
import { LockTooltip } from "@/components/LockTooltip";
import SaveChangesButton from "@/components/SaveChangesButton";
import { Button } from "@/components/ui/button";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useEditableTableContext } from "@/context/editableTable/EditableTableContext";
import { TeamCategory, type TeamCategoryValues } from "@/types/Teams";

export function EditToolbar({ categoryFilter, setCategoryFilter }: GridToolbarProps & ToolbarPropsOverrides) {
	const { Props, Actions, Params } = useEditableTableContext();
	const { updateTeams } = useCompetitionContext();
	const { t } = useTranslation();

	const categoryOptions = useMemo(
		() =>
			Object.values(TeamCategory).map((value) => ({
				value,
				label: t(`teamCategory.${value}`),
			})),
		[t],
	);

	const handleClick = () => {
		if (Params.lockReason) return;
		const id = uuid();

		updateTeams((oldRows) => [
			{
				id,
				name: "",
				members: [],
				// Match the active filter so the new team stays visible.
				category: (categoryFilter as TeamCategoryValues | undefined) ?? TeamCategory.Junior,
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
			<Combobox
				onChange={(value) => setCategoryFilter?.(value)}
				value={categoryFilter}
				options={categoryOptions}
				allowDeselect
				placeholder={t("common.allCategories")}
			/>
		</GridToolbarContainer>
	);
}
