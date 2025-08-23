import {
	DataGrid,
	type GridColDef,
	type GridColumnGroup,
} from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { TABLE_CONSTS } from "@/consts/TableConts";
import { SerieContext } from "@/types/SerieContext";
import type { SummedSerieTeam } from "@/utils/seriesUtils";
import { EditToolbar } from "./toolbar";

const SerieTeamResultTable = () => {
	const { teamResults, teamCategory } = React.useContext(SerieContext);

	const columnGroups = useMemo(() => {
		const sampleContestant = teamResults[0];

		if (!sampleContestant) return [];

		return sampleContestant.placements.map((x) => ({
			groupId: x.compName,
			children: [
				{ field: `${x.compName}-place` },
				{ field: `${x.compName}-score` },
			],
		})) as GridColumnGroup[];
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
			...sampleContestant.placements.flatMap(
				(x) =>
					[
						{
							field: `${x.compName}-place`,
							headerName: "Miejsce",
							...TABLE_CONSTS.REMOVE_MENU,
							valueGetter: (_, row) =>
								row.placements.find((com) => com.compName === x.compName)
									?.place,
						},
						{
							field: `${x.compName}-score`,
							headerName: "Wynik",
							...TABLE_CONSTS.REMOVE_MENU,
							valueGetter: (_, row) =>
								row.placements
									.find((com) => com.compName === x.compName)
									?.score.toFixed(2),
						},
					] as GridColDef<SummedSerieTeam>[],
			),
			{
				field: "totalScore",
				headerName: "Łączny wynik",
				valueGetter: (value) => Number(value).toFixed(2),
				...TABLE_CONSTS.REMOVE_MENU,
			},
			{
				field: "totalPlace",
				headerName: "Punkty",
				...TABLE_CONSTS.REMOVE_MENU,
			},
		] as GridColDef<SummedSerieTeam>[];
	}, [teamResults]);

	const results = useMemo(() => {
		return teamResults
			.filter((x) => x.category === teamCategory)
			.map((con, i) => ({
				...con,
				seriePlace: i + 1,
			}));
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
