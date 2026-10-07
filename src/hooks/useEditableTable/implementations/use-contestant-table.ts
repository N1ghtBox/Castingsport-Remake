import type { GridRowId } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import { useCompetitionContext } from "@/context/competition/CompetitionContext";
import type { EditableContestant } from "@/types/Contestant";
import { useSectionLock } from "@/hooks/useSectionLock";
import { useEditableTable } from "../base/use-editable-table";

type NumberConflict = {
	number: number;
	resolve: (confirmed: boolean) => void;
};

// Moves a contestant from `from` to `to` without leaving a gap: the numbers in between
// slide one step towards the vacated `from`. Without a valid `from`, everything at or
// above `to` moves up by one.
const shiftNumber = (number: number, to: number, from?: number) => {
	if (!from || from === to) return number >= to ? number + 1 : number;
	if (to < from) return number >= to && number < from ? number + 1 : number;
	return number > from && number <= to ? number - 1 : number;
};

export const useContestantEditableTable = () => {
	const competition = useCompetitionContext();
	const lockReason = useSectionLock("contestants");
	// Queued so that saving several rows at once asks about each conflict in turn.
	const [numberConflicts, setNumberConflicts] = useState<NumberConflict[]>([]);
	const [pendingDeleteId, setPendingDeleteId] = useState<GridRowId>();

	const onSave = useCallback(
		(updatedRow: EditableContestant) =>
			competition.updateContestants((prevRows) =>
				prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row)),
			),
		[competition.updateContestants],
	);

	const onDelete = useCallback(
		(id: GridRowId) =>
			competition.updateContestants((contestants) => {
				const deleted = contestants.find((row) => row.id === id);
				const remaining = contestants.filter((row) => row.id !== id);
				// Close the gap, unless another contestant still holds the deleted number.
				if (!deleted || remaining.some((row) => row.number === deleted.number))
					return remaining;

				return remaining.map((row) =>
					row.number > deleted.number ? { ...row, number: row.number - 1 } : row,
				);
			}),
		[competition.updateContestants],
	);

	const rows = useMemo(() => {
		return competition.contestants as EditableContestant[];
	}, [competition.contestants]);

	const tableApi = useEditableTable({
		onSave,
		onDelete,
		rows,
		lockReason,
	});

	const confirmNumberShift = (number: number) =>
		new Promise<boolean>((resolve) =>
			setNumberConflicts((prev) => [...prev, { number, resolve }]),
		);

	const resolveNumberConflict = (confirmed: boolean) => {
		numberConflicts[0]?.resolve(confirmed);
		setNumberConflicts((prev) => prev.slice(1));
	};

	const processRowUpdate = async (
		newRow: EditableContestant,
		oldRow?: EditableContestant,
	) => {
		const isTaken = rows.some(
			(x) => x.id !== newRow.id && x.number === newRow.number,
		);
		if (!isTaken) return tableApi.Props.processRowUpdate(newRow);

		if (!(await confirmNumberShift(newRow.number))) {
			// Keep the other edits, but restore the previous start number.
			return tableApi.Props.processRowUpdate({
				...newRow,
				number: oldRow?.number ?? newRow.number,
			});
		}

		competition.updateContestants((prevRows) =>
			prevRows.map((row) =>
				row.id === newRow.id
					? row
					: { ...row, number: shiftNumber(row.number, newRow.number, oldRow?.number) },
			),
		);
		return tableApi.Props.processRowUpdate(newRow);
	};

	const resolveDelete = (confirmed: boolean) => {
		if (confirmed && pendingDeleteId !== undefined)
			tableApi.Actions.handleDeleteClick(pendingDeleteId);
		setPendingDeleteId(undefined);
	};

	return {
		...tableApi,
		Props: { ...tableApi.Props, processRowUpdate },
		Actions: {
			...tableApi.Actions,
			handleDeleteClick: (id: GridRowId) => {
				if (!lockReason) setPendingDeleteId(id);
			},
		},
		numberConflict: numberConflicts[0]?.number,
		resolveNumberConflict,
		pendingDelete: rows.find((x) => x.id === pendingDeleteId),
		resolveDelete,
	};
};
