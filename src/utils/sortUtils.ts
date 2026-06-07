import ProgramConsts from "@/consts/Consts";
import type { Contest } from "@/types/Contestant";
import { TimeToSeconds } from "./convertUtils";
import type { ValueOf, WithPlace, WithScore, WithTotal } from "./typeUtils";
import type { Placement } from "@/types/BaseTypes";
import type { SeriesTypes } from "@/types/Series";

export const sortByContestWithTime = (
	contestResult1: Pick<Contest, "score" | "time">,
	contestResult2: Pick<Contest, "score" | "time">,
) => {
	const scoreA = contestResult1.score || 0;
	const scoreB = contestResult2.score || 0;

	const timeA = TimeToSeconds(contestResult1.time || "00.00.000");
	const timeB = TimeToSeconds(contestResult2.time || "00.00.000");

	return scoreB - scoreA || timeA - timeB;
};

export const sortByContestWithDoubleScore = (
	contestResult1: Pick<Contest, "score" | "second_score">,
	contestResult2: Pick<Contest, "score" | "second_score">,
) => {
	const scoreA = contestResult1.score || 0;
	const scoreB = contestResult2.score || 0;
	const secondScoreA = contestResult1.second_score || 0;
	const secondScoreB = contestResult2.second_score || 0;

	return scoreB + secondScoreB - (scoreA + secondScoreA);
};

export const sortByContestWithMultiplier = <T extends WithScore<unknown>>(
	contestResult1: T,
	contestResult2: T,
) => {
	const scoreA = contestResult1.score || 0;
	const scoreB = contestResult2.score || 0;

	return (
		scoreB * ProgramConsts.DistanceMultiplier -
		scoreA * ProgramConsts.DistanceMultiplier
	);
};

export const sortByTotal = <T extends WithTotal<unknown>>(
	contestResult1: T,
	contestResult2: T,
) => {
	const scoreA = contestResult1.total || 0;
	const scoreB = contestResult2.total || 0;

	return scoreB - scoreA;
};

export const sortByStartingNumber = (
	contestResult1: { number: number },
	contestResult2: { number: number },
) => {
	const scoreA = contestResult1.number || 0;
	const scoreB = contestResult2.number || 0;

	return scoreB - scoreA;
};

export const sortSeriesResults = (type: ValueOf<typeof SeriesTypes>) => <T extends WithPlace<WithTotal<unknown>>>(
	a: T,
	b: T,
) => {
	if (a.place !== b.place && type === 'Puchar') {
		return a.place - b.place;
	}
	return b.total - a.total;
};

export const sortByCompetitionName = (
	a: Placement,
	b: Placement,
) => {
	return a.competitionName.localeCompare(b.competitionName)
};