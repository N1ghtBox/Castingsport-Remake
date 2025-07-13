import {
	DataGrid,
	type GridColDef,
	type GridColumnGroup,
} from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { TABLE_CONSTS } from "@/consts/TableConts";
import { SerieContext } from "@/types/SerieContext";
import type { SummedSerieContestant } from "@/utils/seriesUtils";
import { EditToolbar } from "./toolbar";

const SerieResultTable = () => {
	const { serieResults, category } = React.useContext(SerieContext);

	const columnGroups = useMemo(() => {
		const sampleContestant = serieResults[0];

		if (!sampleContestant) return [];

		return sampleContestant.compPlacements.map((x) => ({
			groupId: x.compName,
			children: [
				{ field: `${x.compName}-place` },
				{ field: `${x.compName}-score` },
			],
		})) as GridColumnGroup[];
	}, [serieResults]);

	const columns = useMemo(() => {
		const sampleContestant = serieResults[0];

		if (!sampleContestant) return [];

		return [
			{
				field: "seriePlace",
				headerName: "Miejsce",
				...TABLE_CONSTS.REMOVE_MENU,
			},
			{ field: "name", headerName: "Zawodnik", ...TABLE_CONSTS.REMOVE_MENU },
			...sampleContestant.compPlacements.flatMap((x) => [
				{
					field: `${x.compName}-place`,
					headerName: "Miejsce",
					...TABLE_CONSTS.REMOVE_MENU,
					valueGetter: (_, row) => row.compPlacements.find(com => com.compName === x.compName)?.place
				},
				{
					field: `${x.compName}-score`,
					headerName: "Wynik",
					...TABLE_CONSTS.REMOVE_MENU,
					valueGetter: (_, row) => row.compPlacements.find(com => com.compName === x.compName)?.score.toFixed(2)
				},
			] as GridColDef<SummedSerieContestant>[]),
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
		] as GridColDef<SummedSerieContestant>[];
	}, [serieResults]);

	return (
		<DataGrid
			localeText={{
				MuiTablePagination: {
					labelDisplayedRows: (args) =>
						`${args.from} - ${args.to} z ${args.count}`,
				},
			}}
			rows={serieResults
				.filter(x => x.category === category)
				.map((con, i) => ({
					...con,
					seriePlace: i + 1
				}))}
			slots={{ toolbar: EditToolbar }}
			autoPageSize
			columns={columns}
			columnGroupingModel={columnGroups}
		/>
	);
};

export default SerieResultTable;
