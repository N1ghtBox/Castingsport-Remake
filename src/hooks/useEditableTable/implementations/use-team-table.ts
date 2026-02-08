import type { GridRowId } from "@mui/x-data-grid";
import { useCallback, useMemo } from "react";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import type { EditableTeam } from "@/types/Teams";
import { useEditableTable } from "../base/use-editable-table";

export const useTeamEditableTable = () => {
	const competition = useCompetitionContext();
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
		return competition.teams as EditableTeam[];
	}, [competition.teams]);

	const tableApi = useEditableTable({
		onSave,
		onDelete,
		rows,
	});

	return tableApi;
};
