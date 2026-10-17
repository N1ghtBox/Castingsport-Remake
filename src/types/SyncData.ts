import type { KeysOf, WithPlace, WithSeriePlace, WithTotal } from "@/utils/typeUtils";
import type { CategoryValues, Contestant, Contests, Thlon } from "./Contestant";
import type { SerieContestantResult, SerieFinalTeamsResults, Series } from "./Series";
import type { TeamCategoryValues } from "./Teams";

export type SyncResultMap = Record<KeysOf<typeof Thlon>, CategoryValues[]>;

// Format version of the competition document, bump on breaking changes
export const SyncDataVersion = 3;

// Raw score, [score, second_score] for "double" contests or [score, time] for "time" contests
// (time as "MM.SS.mmm", empty when not entered); viewer formats it
export type SyncContestScore = number | [number, number] | [number, string];

// Stored once per contestant, rankings reference it by id
export type SyncContestant = Pick<Contestant, "name" | "club" | "number"> & {
    contests: Partial<Record<Contests, SyncContestScore>>
}

// Objects instead of tuples: Firestore does not allow arrays nested in arrays
export type SyncRankingEntry = WithPlace<WithTotal<{ id: Contestant["id"] }>>

export type SyncTeamMember = WithTotal<{ id: Contestant["id"] }>

export type SyncTeamResult = WithPlace<WithTotal<{
    name: string,
    members: SyncTeamMember[]
}>>

// Finals of one contest and category, ordered by final place
export type SyncFinalEntry = WithPlace<{
    id: Contestant["id"],
    score: number,
    // Only for "time" contests
    time?: string
}>

export type SyncFinals = Partial<Record<Contests, Partial<Record<CategoryValues, SyncFinalEntry[]>>>>

export type SyncData = {
    v: typeof SyncDataVersion,
    name: string,
    date: string,
    contestants: Record<Contestant["id"], SyncContestant>,
    results: Record<KeysOf<typeof Thlon>, Partial<Record<CategoryValues, SyncRankingEntry[]>>>,
    teams: Record<TeamCategoryValues, SyncTeamResult[]>,
    finals: SyncFinals
};

// Series
export type SyncSerieThlon = "5boj" | "9boj" | "multi" | "distance";

export type SyncSerieContestantResult = WithSeriePlace<SerieContestantResult>

export type SyncSerieTeamResult = WithSeriePlace<SerieFinalTeamsResults[number]>

export type SyncSerieData = Record<
    SyncSerieThlon,
    Partial<Record<CategoryValues, SyncSerieContestantResult[]>>
> & {
    name: string,
    year: number,
    type: Series["type"],
    competitions: string[],
    competitionIds: string[],
    teams: Record<TeamCategoryValues, SyncSerieTeamResult[]>
};
