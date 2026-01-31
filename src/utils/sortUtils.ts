import ProgramConsts from "@/consts/Consts";
import type { Contest } from "@/types/Contestant";
import { TimeToSeconds } from "./convertUtils";

export const sortByContestWithTime = (
    contestResult1: Pick<Contest, 'score' | 'time'>,
    contestResult2: Pick<Contest, 'score' | 'time'>,
) => {
    const scoreA = contestResult1.score || 0;
    const scoreB = contestResult2.score || 0;

    const timeA = TimeToSeconds(contestResult1.time || "00.00.000");
    const timeB = TimeToSeconds(contestResult2.time || "00.00.000");

    return scoreB - scoreA || timeA - timeB;
};

export const sortByContestWithDoubleScore = (
    contestResult1: Pick<Contest, 'score' | 'second_score'>,
    contestResult2: Pick<Contest, 'score' | 'second_score'>,
) => {
    const scoreA = contestResult1.score || 0;
    const scoreB = contestResult2.score || 0;
    const secondScoreA = contestResult1.second_score || 0;
    const secondScoreB = contestResult2.second_score || 0;

    return scoreB + secondScoreB - (scoreA + secondScoreA);
};

export const sortByContestWithMultiplier = (
    contestResult1: Pick<Contest, 'score'>,
    contestResult2: Pick<Contest, 'score'>,
) => {
    const scoreA = contestResult1.score || 0;
    const scoreB = contestResult2.score || 0;

    return (
        scoreB * ProgramConsts.DistanceMultiplier -
        scoreA * ProgramConsts.DistanceMultiplier
    );
};
