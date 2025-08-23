import { createContext } from "react";
import type {
	calculateSerieTeamScores,
	SummedSerieContestant,
} from "@/utils/seriesUtils";
import {
	Categories,
	type CategoryValues,
	type TeamCategoryValues,
	type Thlon,
} from "./Contestant";
import type { Series } from "./Series";
import { TeamCategory } from "./Teams";

export type SerieContextProps = {
	serie: Series;
	serieResults: Record<keyof typeof Thlon, SummedSerieContestant[]>;
	category: CategoryValues;
	teamCategory: TeamCategoryValues;
	setCategory: (val: string) => void;
	setTeamCategory: (val: string) => void;
	teamResults: Awaited<ReturnType<typeof calculateSerieTeamScores>>;
};

export const SerieContext = createContext<SerieContextProps>({
	serie: {
		id: "",
		name: "",
		year: new Date().getFullYear(),
		competitionIds: [],
	},
	serieResults: {
		"3boj": [],
		"5boj": [],
		"7boj": [],
		"9boj": [],
		multi: [],
		distance: [],
	},
	category: Categories.Man,
	setCategory: () => { },
	teamCategory: TeamCategory.Junior,
	setTeamCategory: () => { },
	teamResults: [],
});
