import { type Contest, type Contestant, Contests, Thlon } from "../types/Contestant";

export const TakesPartInContests = (
	contestant: Contestant,
	from: number,
	to: number,
) => {
	return (
		contestant.contests.filter(
			(x) =>
				x.id.valueOf() >= from &&
				x.id.valueOf() <= to &&
				x.takesPart,
		).length ===
		to - from + 1
	);
};

export const TakesPartInThlon = (
	contestant: Contestant,
	thlon: keyof typeof Thlon,
) => {
	return (
		contestant.contests.filter(
			(x) =>
				x.id.valueOf() >= Thlon[thlon].from &&
				x.id.valueOf() <= Thlon[thlon].to &&
				x.takesPart,
		).length ===
		Thlon[thlon].to - Thlon[thlon].from + 1
	);
};

export const TakesPartInContest = (
	contestant: Contestant,
	contest: Contests,
): boolean => {
	return contestant.contests.find((x) => x.id === contest)?.takesPart || false;
};

export const SetTakesPartInContests = (
	contestant: Contestant & { isNew: boolean },
	value: boolean,
	thlon: keyof typeof Thlon,
) => {
	const contestsToUpdate = contestant.contests.filter(
		(x) =>
			x.id.valueOf() >= Thlon[thlon].from && x.id.valueOf() <= Thlon[thlon].to,
	);

	for (const contest of contestsToUpdate) {
		contest.takesPart = value;
	}

	return contestant;
};

export const GetThlonResultFromThlon = (
	contestant: Contestant,
	thlon: keyof typeof Thlon,) =>
	GetThlonResult(contestant, Thlon[thlon].from, Thlon[thlon].to);

export const GetThlonResult = (
	contestant: Contestant,
	from: number,
	to: number,
) => {
	return contestant.contests.filter(
		(x) =>
			x.id.valueOf() >= from && x.id.valueOf() <= to,
	).reduce(
		(acc, contest) => acc + contest.total, 0);

};

export const GetContestResult = (
	contest: Contest): number => {
	const type = TypeOfContest(contest.id);
	switch (type) {
		case "double":
			return contest.score + (contest.second_score || 0);
		case "time":
			return contest.score;
		default:
			return contest.score * 1.5;
	}
}

export const TypeOfContest = (contestId: number): "double" | "time" | "single" => {
	switch (contestId) {
		case Contests.FlyDistance:
		case Contests.FlyDistanceDoubleHand:
			return "double";
		case Contests.Skish:
		case Contests.Arenberg:
		case Contests.FlySkish:
		case Contests.MultiSkish:
			return "time";
		default:
			return "single";
	}
};

export const RenderContestScore = (contestId: number, contestant: Contestant) => {
	const type = TypeOfContest(contestId);
	const contest = contestant.contests.find((x) => x.id === contestId);

	if (!contest) {
		return "-";
	}

	switch (type) {
		case "double":
			return `${contest.score}\t${contest.second_score || 0}`;
		case "time":
			return `${contest.score}`;
		default:
			return `${contest.score * 1.5}`;
	}
};

