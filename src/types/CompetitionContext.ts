import type { Contestant } from "@/types/Contestant";
import type Team from "./Teams";
import type Competition from "./Competition";

export type CompetitionContextProps = {
	contestants: Array<Contestant>;
	teams: Array<Team>;
	loading: boolean;
	compInfo: Omit<Competition, "id">,
	updateContestants: React.Dispatch<React.SetStateAction<(Contestant & { isNew: boolean })[]>>;
	updateTeams: React.Dispatch<React.SetStateAction<(Team & { isNew: boolean })[]>>;
	updateScores: (contestants: Contestant[]) => void;
	setTab: (contestId: number) => void;
};
