import type { CategoryValues, Contestant, Contests } from "@/types/Contestant";

export type ContestContextProps = {
	currentContestants: Array<Contestant>;
	category?: CategoryValues;
	setCategoryFilter: (category?: CategoryValues) => void;
	contestId: Contests
};
