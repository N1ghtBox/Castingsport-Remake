import type { GridRowId } from "@mui/x-data-grid";
import { useCallback, useContext, useMemo } from "react";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import type { EditableContestant } from "@/types/Contestant";
import { ContestContext } from "@/types/ContestContext";
import { useEditableTable } from "../base/use-editable-table";

export const useContestEditableTable = () => {
    const competition = useCompetitionContext();
    const contest = useContext(ContestContext);
    const onSave = useCallback(
        (updatedRow: EditableContestant) =>
            competition.updateContestants((prevRows) =>
                prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
            ),
        [competition.updateContestants],
    );

    const onDelete = useCallback(
        (id: GridRowId) =>
            competition.updateContestants((contestants) =>
                contestants.filter((row) => row.id !== id),
            ),
        [competition.updateContestants],
    );

    const rows = useMemo(() => {
        return contest.currentContestants as EditableContestant[];
    }, [contest.currentContestants]);

    const tableApi = useEditableTable({
        onSave,
        onDelete,
        rows,
    });

    return tableApi;
};
