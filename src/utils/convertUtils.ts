import type { GridColDef, GridColumnGroup } from "@mui/x-data-grid";
import { TABLE_CONSTS } from "@/consts/TableConts";
import type { Placement } from "@/types/BaseTypes";
import type { Subcategory } from "@/types/Competition";
import type { CategoryValues, Contestant, Thlon } from "@/types/Contestant";
import { GetThlonResult } from "./contestUtils";
import {
	ByContestantCategoryInThlon,
	ByTakesPartInThlon,
	BySubcategory,
	chainFilters,
} from "./filterUtils";
import { sortByTotal } from "./sortUtils";
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
	({ from, to }: Thlon) =>
		<T extends Contestant>(model: T): WithTotal<T> => {
			return { ...model, total: GetThlonResult(model, from, to) };
		};

export const AddTotalAndPlaceFromPlacements = <T extends WithPlacements>(
	model: T,
): WithTotal<WithPlace<T>> => {
	return {
		...model,
		total: model.placements.reduce((sum, item) => sum + item.score, 0),
		place: model.placements.reduce((sum, item) => sum + item.place, 0),
	};
};

export const AddSeriePlace = <T>(
	model: T,
	index: number,
): WithSeriePlace<T> => {
	return { ...model, seriePlace: index + 1 };
};

/**
 * Puts legacy contestants (subcategories never set) into every subcategory, so adding subcategories
 * to an existing competition does not blank its result lists. An explicit [] means "no subcategory"
 * and is preserved; competitions without subcategories are left untouched, so the field stays
 * undefined and remains eligible for this backfill later.
 */
export const AddDefaultSubcategories =
	(subcategories: Subcategory[] | undefined) =>
		<T extends Pick<Contestant, "subcategories">>(contestant: T): T => {
			if (!subcategories?.length || contestant.subcategories) return contestant;
			return { ...contestant, subcategories: subcategories.map((x) => x.id) };
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

export const GenerateThlonResults = (
	contestants: Contestant[],
	categoryFilter: CategoryValues | undefined,
	thlon: Thlon,
	subcategoryId?: string,
) =>
	contestants
		.filter(
			chainFilters(
				ByContestantCategoryInThlon(categoryFilter, thlon),
				ByTakesPartInThlon(thlon),
				BySubcategory(subcategoryId),
			),
		)
		.map(AddTotal(thlon))
		.sort(sortByTotal)
		.map(AddPlace);
