import { createContext } from "react";
import type { CategoryValues, Contestant } from "./Contestant";

export type ContestContextProps = {
	currentContestants: Array<Contestant>;
	setCategoryFilter: (category?: CategoryValues) => void;
	category?: CategoryValues;
	contestMultiplier?: number;
	setContestMultiplier: (multiplier?: number) => void;
};

export const ContestContext = createContext<ContestContextProps>({
	currentContestants: [],
	contestMultiplier: undefined,
	setCategoryFilter: () => {},
	category: undefined,
	setContestMultiplier: () => {},
});
