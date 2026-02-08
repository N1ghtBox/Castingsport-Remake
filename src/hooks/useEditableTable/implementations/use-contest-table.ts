import { useCallback, useMemo } from "react";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useContestContext } from "@/context/contest/ContestContext";
import type { EditableContestant } from "@/types/Contestant";
import { useEditableTable } from "../base/use-editable-table";

export const useContestEditableTable = () => {
	const competition = useCompetitionContext();
	const { currentContestants } = useContestContext();
	const onSave = useCallback(
		(updatedRow: EditableContestant) =>
			competition.updateContestants((prevRows) =>
				prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
			),
		[competition.updateContestants],
	);

	const rows = useMemo(() => {
		return currentContestants as EditableContestant[];
	}, [currentContestants]);

	const tableApi = useEditableTable({
		onSave,
		rows,
	});

	return tableApi;
};
