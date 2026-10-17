import type { GridRowId } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import type { EditableTeam, TeamCategoryValues } from "@/types/Teams";
import { useSectionLock } from "@/hooks/useSectionLock";
import { useEditableTable } from "../base/use-editable-table";

export const useTeamEditableTable = () => {
	const competition = useCompetitionContext();
	const lockReason = useSectionLock("teams");
	const [categoryFilter, setCategoryFilter] = useState<TeamCategoryValues>();

	const onSave = useCallback(
		(updatedRow: EditableTeam) =>
			competition.updateTeams((prevRows) =>
				prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
			),
		[competition.updateTeams],
	);

	const onDelete = useCallback(
		(id: GridRowId) =>
			competition.updateTeams((teams) => teams.filter((row) => row.id !== id)),
		[competition.updateTeams],
	);

	const rows = useMemo(() => {
		const teams = competition.teams as EditableTeam[];
		return categoryFilter
			? teams.filter((x) => x.category === categoryFilter)
			: teams;
	}, [competition.teams, categoryFilter]);

	const tableApi = useEditableTable({
		onSave,
		onDelete,
		rows,
		lockReason,
	});

	return {
		...tableApi,
		categoryFilter,
		setCategoryFilter: (category: string | undefined) =>
			setCategoryFilter(category as TeamCategoryValues | undefined),
	};
};
