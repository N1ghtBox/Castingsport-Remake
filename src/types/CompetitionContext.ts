import { Contests, type Contestant } from "@/types/Contestant";
import type Team from "./Teams";
import type Competition from "./Competition";
import { createContext } from "react";
import type PlatformConfig from "./PlatformConfig";
import type TimeConfig from "./TimeConfig";

export type CompetitionContextProps = {
	contestants: Array<Contestant>;
	teams: Array<Team>;
	loading: boolean;
	compInfo: Omit<Competition, "id">,
	updateContestants: React.Dispatch<React.SetStateAction<(Contestant & { isNew: boolean })[]>>;
	updateTeams: React.Dispatch<React.SetStateAction<(Team & { isNew: boolean })[]>>;
	updateScores: (contestants: Contestant[]) => void;
	setTab: (contestId: number) => void;
	updateConfig: (config: { platformConfig: PlatformConfig, timeConfig: TimeConfig }) => void;
};

export const defaultPlatformConfig = {
	[Contests.FlySkish]: 6,
	[Contests.Arenberg]: 6,
	[Contests.Skish]: 6,
	[Contests.FlyDistance]: 4,
	[Contests.Distance]: 4,
	[Contests.MultiSkish]: 6,
	[Contests.FlyDistanceDoubleHand]: 2,
	[Contests.DistanceDoubleHand]: 2,
	[Contests.MultiDistance]: 2,
}

export const DefaultCompetition = {
	id: "",
	name: "",
	place: "",
	logoUrl: '',
	dateFrom: new Date(),
	dateTo: new Date(),
	platformConfig: defaultPlatformConfig,
	timeConfig: {}
}

export const CompetitonContext = createContext<CompetitionContextProps>({
	contestants: [],
	teams: [],
	compInfo: DefaultCompetition,
	updateContestants: () => { },
	updateTeams: () => { },
	updateScores: () => { },
	setTab: () => { },
	updateConfig: () => { },
	loading: true,
});