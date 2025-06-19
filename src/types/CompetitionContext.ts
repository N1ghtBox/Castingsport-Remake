import type { Contestant } from "@/types/Contestant";

export type CompetitionContextProps = {
	contestants: Array<Contestant>;
	name: string;
	loading: boolean;
	updateContestants: React.Dispatch<React.SetStateAction<(Contestant & { isNew: boolean })[]>>;
	updateScores: (contestants: Contestant[]) => void;
	setTab: (contestId: number) => void;
};
