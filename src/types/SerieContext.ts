import { createContext } from "react";
import type { SummedSerieContestant } from "@/utils/seriesUtils";
import { Categories, type CategoryValues } from "./Contestant";

export type SerieContextProps = {
	serieResults: SummedSerieContestant[];
	category: CategoryValues,
	setCategory: (val: string) => void
};

export const SerieContext = createContext<SerieContextProps>({
	serieResults: [],
	category: Categories.Man,
	setCategory: () => { }
});
