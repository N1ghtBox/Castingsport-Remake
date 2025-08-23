import type { Contestant } from "./Contestant";
import type Team from "./Teams";

type CompetitionData = {
	name: string;
	contestants: Array<Contestant>;
	teams: Array<Team>;
};

export default CompetitionData;
