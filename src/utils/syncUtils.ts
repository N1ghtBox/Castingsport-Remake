import ProgramConsts from "@/consts/Consts";
import { type Contest, type Contestant, Thlon } from "@/types/Contestant";
import type { SyncContestantResult, SyncData, SyncResultMap } from "@/types/SyncData";
import { TypeOfContest } from "./contestUtils";
import { GenerateThlonResults } from "./convertUtils";
import type { KeysOf } from "./typeUtils";

export const resultsMap = {
    "3boj": ["Kadet", "Junior", "Juniorka", "Kobieta", "Mężczyzna"],
    "5boj": ["Junior", "Juniorka", "Kobieta", "Mężczyzna"],
    "7boj": ["Kobieta", "Mężczyzna"],
    "9boj": ["Kobieta", "Mężczyzna"],
    multi: ["Kobieta", "Mężczyzna"],
    distance: ["Kobieta", "Mężczyzna"],
} satisfies SyncResultMap;

export const generateSyncData = (contestants: Contestant[], name: string, date: string): SyncData => {
    const data: Partial<SyncData> = {
        name,
        date
    };

    for (const key of Object.keys(resultsMap) as KeysOf<typeof Thlon>[]) {
        const categories = resultsMap[key];

        for (const cat of categories) {
            const results = GenerateThlonResults(contestants, cat, Thlon[key]).map(
                ({ contests, ...rest }) => {
                    contests.filter(x => x.takesPart).forEach((cont) => {
                        (rest as SyncContestantResult)[`contest-${cont.id}`]
                            = getSyncFormatContestResults(cont);
                    });

                    return rest as SyncContestantResult;
                },
            );

            if (!data[key]) data[key] = {};

            data[key][cat] = results;
        }
    }

    return data as SyncData;
};

const getSyncFormatContestResults = (contest: Contest) => {
    const type = TypeOfContest(contest.id);

    if (type === "time") return contest.score.toString();

    if (type === "double") return `${contest.score.toFixed(2)} ${contest.second_score?.toFixed(2) ?? 0}`;

    return `${contest.score} ${(contest.score * ProgramConsts.DistanceMultiplier).toFixed(2)}`;
};
