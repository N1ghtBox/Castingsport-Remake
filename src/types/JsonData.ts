import type { Competition } from "./Competition";
import type { Contestant } from "./Contestant";
import type { Series } from "./Series";
import type { Team } from "./Teams";

export type GeneralListsJson = {
    competitions: Array<Competition>;
    series: Array<Series>;
};

export type CompetitionJsonData = {
    name: string;
    contestants: Array<Contestant>;
    teams: Array<Team>;
};
