import type { Contestant } from "@/types/Contestant";

export type CompetitionContextProps = {
	contestants: Array<Contestant>;
	name: string;
	updateContestants: (contestant: Contestant[]) => void;
	updateScores: (contestants: Contestant[]) => void;
	setTab: (contestId: number) => void;
};
