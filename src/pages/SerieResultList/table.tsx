import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useLoaderData } from "react-router";
import { TABLE_CONSTS } from "@/consts/TableConts";
import { useSerieContext } from "@/context/serie/SerieContext";
import { Categories } from "@/types/Contestant";
import type { SerieContestantResult } from "@/types/Series";
import { getThlonEnumName } from "@/utils/contestUtils";
import {
	AddSeriePlace,
	ToTableColumns,
	ToTableHeaderGroup,
} from "@/utils/convertUtils";
import { EditToolbar } from "./toolbar";

const SerieResultTable = () => {
	const { serieResults, category } = useSerieContext();
	const { from, to } = useLoaderData();

	const columnGroups = useMemo(() => {
		const sampleContestant = serieResults["5boj"][0];

		if (!sampleContestant) return [];

		return sampleContestant.placements.map(ToTableHeaderGroup);
	}, [serieResults]);

	const columns = useMemo(() => {
		const sampleContestant = serieResults["5boj"][0];

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
		] as GridColDef<SerieContestantResult>[];
	}, [serieResults]);

	const results = useMemo(() => {
		const thlonName = getThlonEnumName(from, to);

		return serieResults[thlonName]
			.filter((x) => {
				if (
					thlonName === "distance" ||
					thlonName === "multi" ||
					thlonName === "9boj"
				) {
					if (x.category === "Junior") return category === Categories.Man;
					if (x.category === "Juniorka") return category === "Kobieta";
				}
				return x.category === category;
			})
			.map(AddSeriePlace);
	}, [serieResults, category, from, to]);

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
			columns={columns}
			columnGroupingModel={columnGroups}
		/>
	);
};

export default SerieResultTable;
