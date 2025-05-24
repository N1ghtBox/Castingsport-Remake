import type { CategoryValues, Contestant } from "./Contestant";

export type ContestContextProps = {
	currentContestants: Array<Contestant>;
	setCategoryFilter: (category?: CategoryValues) => void,
	category?: CategoryValues
};
