import { type Contestant, type Contests, Thlon } from "../types/Contestant";

export const TakesPartInContests = (
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
