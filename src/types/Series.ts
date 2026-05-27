import type {
	KeysOf,
	Prettify,
	ValueOf,
	WithPlace,
	WithPlacements,
	WithTotal,
} from "@/utils/typeUtils";
import type { Contestant, Thlon } from "./Contestant";
import type { Team } from "./Teams";

export type Series = {
	id: string;
	name: string;
	competitionIds: string[];
	year: number;
	type: ValueOf<typeof SeriesTypes>;
};

//Teams
type TeamInfo = Pick<Team, "category" | "id" | "name">;

export type CompetitionTeamResult = Prettify<WithTotal<WithPlace<TeamInfo>>>;

export type SerieTeamResult = Prettify<WithPlacements<CompetitionTeamResult>>;

export type SerieFinalTeamsResults = Prettify<
	WithTotal<WithPlace<SerieTeamResult>>
>[];

//Contestants
type ContestantInfo = Pick<Contestant, "id" | "name" | "category" | "club" | 'girl'>;

export type ForEachThlon<T> = Record<KeysOf<typeof Thlon>, T>;

export type CompetitionContestantResult = Prettify<
	WithTotal<WithPlace<ContestantInfo>>
>;

export type CompetitionFinalContestantResults = ForEachThlon<
	CompetitionContestantResult[]
>;

export type SerieContestantResult = Prettify<WithPlacements<CompetitionContestantResult>>;

export type SerieFinalContestantResults = ForEachThlon<SerieContestantResult[]>;

export const SeriesTypes = {
	puchar: "Puchar",
	tury: "Tury",
} as const;
