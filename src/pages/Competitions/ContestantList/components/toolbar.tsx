import { Add } from "@mui/icons-material";
import {
	GridRowModes,
	GridToolbarContainer,
	type GridToolbarProps,
	type ToolbarPropsOverrides,
	GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { v7 as uuid } from "uuid";
import { Combobox } from "@/components/Combobox";
import { LockTooltip } from "@/components/LockTooltip";
import SaveChangesButton from "@/components/SaveChangesButton";
import { Button } from "@/components/ui/button";
import PrintButton from "@/components/ui/PrintButton";
import ProgramConsts from "@/consts/Consts";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useEditableTableContext } from "@/context/editableTable/EditableTableContext";
import { useCtrlShortcut } from "@/hooks/useCtrlShortcut";
import { Categories, type CategoryValues, ValidCategories } from "../../../../types/Contestant";
import { getDefaultContestList } from "../utils";

export function EditToolbar({ categoryFilter, setCategoryFilter }: GridToolbarProps & ToolbarPropsOverrides) {
	const tableContext = useEditableTableContext();
	const competitionContext = useCompetitionContext();
	const { t } = useTranslation();

	const { lockReason } = tableContext.Params;

	const categoryOptions = useMemo(
		() =>
			ValidCategories.map((value) => ({
				value,
				label: t(`category.${value}` as any, value),
			})),
		[t],
	);

	const handleClick = () => {
		if (lockReason) return;
		const id = uuid();

		const lastCategoryAdded = window.localStorage.getItem(
			ProgramConsts.Keys.LastSaveCategory,
		);

		const categoryToAdd =
			(categoryFilter as CategoryValues | undefined) ||
			(lastCategoryAdded as CategoryValues) ||
			Categories.Kadet;

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

	// Ctrl+A adds a contestant, except while typing in a field where it keeps its usual "select all" meaning.
	useCtrlShortcut("a", handleClick);

	return (
		<GridToolbarContainer style={{ margin: 10, display: "flex" }}>
			<LockTooltip reason={lockReason}>
				<Button
					color="primary"
					title="Ctrl+A"
					disabled={!!lockReason}
					onClick={handleClick}>
					<Add />
					{t("common.add")}
				</Button>
			</LockTooltip>
			<SaveChangesButton
				pendingRows={tableContext.Params.pendingRows}
				saveChanges={tableContext.Actions.handleSaveClick}
			/>
			<Combobox
				onChange={(value) => setCategoryFilter?.(value)}
				value={categoryFilter}
				options={categoryOptions}
				allowDeselect
				placeholder={t("common.allCategories")}
			/>
			<PrintButton />
			<GridToolbarQuickFilter style={{ marginLeft: "auto" }} placeholder={t("common.search")} />
		</GridToolbarContainer>
	);
}
