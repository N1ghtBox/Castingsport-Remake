import type { CategoryValues, Contestant } from "@/types/Contestant";

export type ContestContextProps = {
	currentContestants: Array<Contestant>;
	category?: CategoryValues;
	contestMultiplier?: number;
	setCategoryFilter: (category?: CategoryValues) => void;
	setContestMultiplier: (multiplier?: number) => void;
};
