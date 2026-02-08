import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { TABLE_CONSTS } from "@/consts/TableConts";
import { useSerieContext } from "@/context/serie/SerieContext";
import type { SerieTeamResult } from "@/types/Series";
import {
	AddSeriePlace,
	ToTableColumns,
	ToTableHeaderGroup,
} from "@/utils/convertUtils";
import { ByTeamCategory } from "@/utils/filterUtils";
import { EditToolbar } from "./toolbar";

const SerieTeamResultTable = () => {
	const { teamResults, teamCategory } = useSerieContext();

	const columnGroups = useMemo(() => {
		const sampleContestant = teamResults[0];

		if (!sampleContestant) return [];

		return sampleContestant.placements.map(ToTableHeaderGroup);
	}, [teamResults]);

	const columns = useMemo(() => {
		const sampleContestant = teamResults[0];

		if (!sampleContestant) return [];

		return [
			{
				field: "seriePlace",
				headerName: "Miejsce",
				...TABLE_CONSTS.REMOVE_MENU,
			},
			{ field: "name", headerName: "Zawodnik", ...TABLE_CONSTS.REMOVE_MENU },
			...sampleContestant.placements.flatMap(ToTableColumns),
			{
				field: "total",
				headerName: "Łączny wynik",
				valueGetter: (value) => Number(value).toFixed(2),
				...TABLE_CONSTS.REMOVE_MENU,
			},
			{
				field: "place",
				headerName: "Punkty",
				...TABLE_CONSTS.REMOVE_MENU,
			},
		] as GridColDef<SerieTeamResult>[];
	}, [teamResults]);

	const results = useMemo(() => {
		return teamResults.filter(ByTeamCategory(teamCategory)).map(AddSeriePlace);
	}, [teamResults, teamCategory]);

	return (
		<DataGrid
			localeText={{
				MuiTablePagination: {
					labelDisplayedRows: (args) =>
						`${args.from} - ${args.to} z ${args.count}`,
				},
			}}
			rows={results}
			style={{ border: "none" }}
			slots={{ toolbar: EditToolbar }}
			autoPageSize
			rowSelection={false}
			columns={columns}
			columnGroupingModel={columnGroups}
		/>
	);
};

export default SerieTeamResultTable;
