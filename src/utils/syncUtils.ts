import type { FormData as FinalsFormData } from "@/components/FinalsButton/types/FinalsForm.types";
import ProgramConsts from "@/consts/Consts";
import type { Placement } from "@/types/BaseTypes";
import {
    type Contest,
    type Contestant,
    Contests,
    Thlon,
    ValidCategories,
} from "@/types/Contestant";
import type {
    SerieFinalContestantResults,
    SerieFinalTeamsResults,
    Series,
} from "@/types/Series";
import {
    type SyncContestant,
    type SyncContestScore,
    type SyncData,
    SyncDataVersion,
    type SyncFinalEntry,
    type SyncFinals,
    type SyncResultMap,
    type SyncSerieData,
    type SyncSerieThlon,
    type SyncTeamResult,
} from "@/types/SyncData";
import {
    type Team,
    TeamCategory,
    type TeamCategoryValues,
} from "@/types/Teams";
import { TypeOfContest } from "./contestUtils";
import { AddSeriePlace, GenerateThlonResults } from "./convertUtils";
import { ByContestantCategoryInThlon } from "./filterUtils";
import { getSerieCategories } from "./seriesUtils";
import { sortByCompetitionName, sortByContestWithTime } from "./sortUtils";
import { GenerateTeamResults } from "./teamUtils";
import type { KeysOf } from "./typeUtils";

export const resultsMap = {
    "3boj": ["Kadet", "Junior", "Juniorka", "Kobieta", "Mężczyzna"],
    "5boj": ["Junior", "Juniorka", "Kobieta", "Mężczyzna"],
    "7boj": ["Kobieta", "Mężczyzna"],
    "9boj": ["Kobieta", "Mężczyzna"],
    multi: ["Kobieta", "Mężczyzna"],
    distance: ["Kobieta", "Mężczyzna"],
} satisfies SyncResultMap;

export const generateSyncData = (
    contestants: Contestant[],
    teams: Team[],
    name: string,
    date: string,
    competitionId: string,
): SyncData => {
    const contestantsById = new Map(contestants.map((x) => [x.id, x]));
    const syncContestants: SyncData["contestants"] = {};

    // Registers the contestant in the shared map and returns the reference
    const reference = (id: Contestant["id"]) => {
        const contestant = contestantsById.get(id);
        if (contestant && !syncContestants[id])
            syncContestants[id] = toSyncContestant(contestant);
        return id;
    };

    const results = {} as SyncData["results"];

    for (const key of Object.keys(resultsMap) as KeysOf<typeof Thlon>[]) {
        results[key] = {};

        for (const cat of resultsMap[key]) {
            results[key][cat] = GenerateThlonResults(
                contestants,
                cat,
                Thlon[key],
            ).map(({ id, total, place }) => ({ id: reference(id), total, place }));
        }
    }

    const teamResults = (category: TeamCategoryValues): SyncTeamResult[] =>
        GenerateTeamResults(teams, contestants, category).map(
            ({ id, name, total, place, members }) => {
                // GetTeamResult keeps the order of team.members, so indexes line up
                const memberIds = teams.find((x) => x.id === id)?.members ?? [];

                return {
                    name,
                    total,
                    place,
                    members: members.map((member, i) => ({
                        id: reference(memberIds[i]),
                        total: member.total,
                    })),
                };
            },
        );

    return {
        v: SyncDataVersion,
        name,
        date,
        results,
        teams: {
            [TeamCategory.Junior]: teamResults(TeamCategory.Junior),
            [TeamCategory.Senior]: teamResults(TeamCategory.Senior),
            [TeamCategory.Women]: teamResults(TeamCategory.Women),
        },
        finals: generateSyncFinals(contestants, competitionId, reference),
        contestants: syncContestants,
    };
};

const readSavedFinals = (key: string): FinalsFormData => {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as FinalsFormData) : undefined;
    } catch {
        return undefined;
    }
};

const parseFinalScore = (score: string | undefined) => {
    const value = Number.parseFloat((score ?? "0").replace(",", "."));
    return Number.isNaN(value) ? 0 : value;
};

// Finals are saved per contest and category by the finals form (see ContestResults)
const generateSyncFinals = (
    contestants: Contestant[],
    competitionId: string,
    reference: (id: Contestant["id"]) => Contestant["id"],
): SyncFinals => {
    const finals: SyncFinals = {};

    for (const contestId of Object.values(Contests).filter(
        (x): x is Contests => typeof x === "number",
    )) {
        const isTime = TypeOfContest(contestId) === "time";

        for (const category of ValidCategories) {
            const saved = readSavedFinals(
                ProgramConsts.Keys.FinalsResults(
                    `${competitionId}-${contestId}-${category}`,
                ),
            );
            if (!saved?.finals?.length) continue;

            // Same order as the printed results (ResultTable)
            const entries = saved.finals
                .map((x) => ({
                    contestant: contestants.find((c) => c.number.toString() === x.number),
                    score: isTime ? (x.result ?? 0) : parseFinalScore(x.score),
                    time: x.time,
                }))
                .filter((x) => x.contestant !== undefined)
                .sort((a, b) =>
                    isTime ? sortByContestWithTime(a, b) : b.score - a.score,
                )
                .map(
                    ({ contestant, score, time }, i): SyncFinalEntry => ({
                        id: reference((contestant as Contestant).id),
                        place: i + 1,
                        score,
                        // Firestore rejects undefined fields
                        ...(isTime ? { time: time ?? "" } : {}),
                    }),
                );

            if (entries.length === 0) continue;
            finals[contestId] ??= {};
            (finals[contestId] as NonNullable<SyncFinals[Contests]>)[category] =
                entries;
        }
    }

    return finals;
};

const toSyncContestant = ({
    name,
    club,
    number,
    contests,
}: Contestant): SyncContestant => ({
    name,
    club,
    number,
    contests: Object.fromEntries(
        contests
            .filter((x) => x.takesPart)
            .map((x) => [x.id, toSyncContestScore(x)]),
    ),
});

const toSyncContestScore = (contest: Contest): SyncContestScore => {
    switch (TypeOfContest(contest.id)) {
        case "double":
            return [contest.score, contest.second_score ?? 0];
        case "time":
            return [contest.score, contest.time ?? ""];
        default:
            return contest.score;
    }
};

const serieThlons = [
    "5boj",
    "9boj",
    "multi",
    "distance",
] as const satisfies SyncSerieThlon[];

export const generateSerieSyncData = (
    serie: Series,
    results: SerieFinalContestantResults,
    teamResults: SerieFinalTeamsResults,
): SyncSerieData => {
    const byCompetitionName = <T extends { placements: Placement[] }>(
        con: T,
    ): T => ({
        ...con,
        placements: [...con.placements].sort(sortByCompetitionName),
    });

    const data: Partial<SyncSerieData> = {
        name: serie.name,
        year: serie.year,
        type: serie.type,
        competitionIds: serie.competitionIds,
        competitions: [
            ...new Set(
                Object.values(results)
                    .flat()
                    .flatMap((x) => x.placements.map((p) => p.competitionName)),
            ),
        ].sort((a, b) => a.localeCompare(b)),
        teams: Object.fromEntries(
            Object.values(TeamCategory).map((category) => [
                category,
                teamResults
                    .filter((x) => x.category === category)
                    .map(byCompetitionName)
                    .map(AddSeriePlace),
            ]),
        ) as SyncSerieData["teams"],
    };

    for (const key of serieThlons) {
        const { from, to } = Thlon[key];
        data[key] = {};

        for (const cat of getSerieCategories(from, to)) {
            data[key][cat] = results[key]
                .filter(ByContestantCategoryInThlon(cat, { from, to }))
                .map(byCompetitionName)
                .map(AddSeriePlace);
        }
    }

    return data as SyncSerieData;
};
