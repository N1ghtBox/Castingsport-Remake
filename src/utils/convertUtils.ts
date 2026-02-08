import type { GridColDef, GridColumnGroup } from "@mui/x-data-grid";
import { TABLE_CONSTS } from "@/consts/TableConts";
import type { Placement } from "@/types/BaseTypes";
import type { Contestant } from "@/types/Contestant";
import { GetThlonResult } from "./contestUtils";
import type {
	WithPlace,
	WithPlacements,
	WithSeriePlace,
	WithTotal,
} from "./typeUtils";

export const TimeToSeconds = (time: string): number => {
	const [minutes, seconds, miliseconds] = time.split(".").map(Number);
	return minutes * 60 + seconds + miliseconds / 1000;
};

export const AddPlace = <T>(model: T, index: number): WithPlace<T> => {
	return { ...model, place: index + 1 };
};

export const AddTotal =
	(from: number, to: number) =>
		<T extends Contestant>(model: T): WithTotal<T> => {
			return { ...model, total: GetThlonResult(model, from, to) };
		};

export const AddSeriePlace = <T>(
	model: T,
	index: number,
): WithSeriePlace<T> => {
	return { ...model, seriePlace: index + 1 };
};

export const GetAllUniqueClubs = (contestants: Contestant[]) => {
	return Array.from(new Set(contestants.map((x) => x.club))).filter(Boolean);
};

export const ToTableHeaderGroup = ({
	competitionName,
}: Placement): GridColumnGroup => ({
	groupId: competitionName,
	children: [
		{ field: `${competitionName}-place` },
		{ field: `${competitionName}-score` },
	],
});

export const ToTableColumns = <TRow extends WithPlacements<unknown>>({
	competitionName,
}: Placement): [GridColDef<TRow>, GridColDef<TRow>] => {
	return [
		{
			field: `${competitionName}-place`,
			headerName: "Miejsce",
			...TABLE_CONSTS.REMOVE_MENU,
			valueGetter: (_, row) =>
				row.placements.find((com) => com.competitionName === competitionName)
					?.place,
		},
		{
			field: `${competitionName}-score`,
			headerName: "Wynik",
			...TABLE_CONSTS.REMOVE_MENU,
			valueGetter: (_, row) =>
				row.placements
					.find((com) => com.competitionName === competitionName)
					?.score.toFixed(2),
		},
	];
};
