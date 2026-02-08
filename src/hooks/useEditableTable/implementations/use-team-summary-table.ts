import { useMemo } from "react";
import { useTeamContext } from "@/context/team/TeamContext";
import type { FinalScoreTeam } from "@/types/Teams";
import { useEditableTable } from "../base/use-editable-table";

export const useTeamSummaryTable = () => {
	const { teamResults } = useTeamContext();

	const rows = useMemo(() => {
		return teamResults as FinalScoreTeam[];
	}, [teamResults]);

	const tableApi = useEditableTable({
		rows,
	});

	return tableApi;
};
