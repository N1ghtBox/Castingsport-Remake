import { createContext } from "react";
import type { SummedSerieContestant } from "@/utils/seriesUtils";
import { Categories, Thlon, type CategoryValues } from "./Contestant";

export type SerieContextProps = {
	serieResults: Record<keyof typeof Thlon, SummedSerieContestant[]>;
	category: CategoryValues,
	setCategory: (val: string) => void
};

export const SerieContext = createContext<SerieContextProps>({
	serieResults: {
		"3boj": [],
		"5boj": [],
		"7boj": [],
		"9boj": [],
		multi: [],
		distance: [],
	},
	category: Categories.Man,
	setCategory: () => { }
});
