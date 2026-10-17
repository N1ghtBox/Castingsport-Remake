import { useCallback, useMemo } from "react";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import { useContestContext } from "@/context/contest/ContestContext";
import type { EditableContestant } from "@/types/Contestant";
import { useSectionLock } from "@/hooks/useSectionLock";
import { useEditableTable } from "../base/use-editable-table";

export const useContestEditableTable = () => {
	const competition = useCompetitionContext();
	const lockReason = useSectionLock("results");
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
		lockReason,
	});

	return tableApi;
};
