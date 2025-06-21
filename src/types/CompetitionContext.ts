import type { Contestant } from "@/types/Contestant";
import type Team from "./Teams";

export type CompetitionContextProps = {
	contestants: Array<Contestant>;
	teams: Array<Team>;
	name: string;
	loading: boolean;
	updateContestants: React.Dispatch<React.SetStateAction<(Contestant & { isNew: boolean })[]>>;
	updateTeams: React.Dispatch<React.SetStateAction<(Team & { isNew: boolean })[]>>;
	updateScores: (contestants: Contestant[]) => void;
	setTab: (contestId: number) => void;
};
