import {
	Categories,
	type CategoryValues,
	type Contest,
	type Contestant,
	Contests,
	Thlon,
} from "../types/Contestant";

export const TakesPartInContests = (
	contestant: Contestant,
	from: number,
	to: number,
) => {
	return (
		contestant.contests.filter(
			(x) => x.id.valueOf() >= from && x.id.valueOf() <= to && x.takesPart,
		).length ===
		to - from + 1
	);
};

export const FilterByCategory = (
	contestant: Contestant,
	category: CategoryValues,
	from: number,
	to: number,
) => {
	let localContestantCategory = contestant.category;
	if (Number(from) <= Contests.FlyDistance)
		localContestantCategory =
			contestant.category === "Kadet" && category !== "Kadet"
				? contestant.girl
					? Categories.Juniorka
					: Categories.Junior
				: contestant.category;

	if (
		Number(to) > Contests.Distance &&
		((localContestantCategory === "Kadet" && !contestant.girl) ||
			localContestantCategory === "Junior" ||
			localContestantCategory === "Mężczyzna")
	)
		localContestantCategory = "Mężczyzna";
	else if (
		Number(to) > Contests.Distance &&
		((localContestantCategory === "Kadet" && contestant.girl) ||
			localContestantCategory === "Juniorka" ||
			localContestantCategory === "Kobieta")
	)
		localContestantCategory = "Kobieta";


	return localContestantCategory === category;
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
	thlon: keyof typeof Thlon,
) => GetThlonResult(contestant, Thlon[thlon].from, Thlon[thlon].to);

export const GetThlonResult = (
	contestant: Contestant,
	from: number,
	to: number,
) => {
	return Number(
		contestant.contests
			.filter((x) => x.id.valueOf() >= from && x.id.valueOf() <= to)
			.reduce((acc, contest) => acc + contest.total, 0)
			.toFixed(2),
	);
};

export const GetContestResult = (contest: Contest): number => {
	const type = TypeOfContest(contest.id);
	switch (type) {
		case "double":
			return contest.score + (contest.second_score || 0);
		case "time":
			return contest.score;
		default:
			return contest.score * 1.5;
	}
};

export const TypeOfContest = (
	contestId: number,
): "double" | "time" | "single" => {
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

export const getThlonName = (from: number, to: number) => {
	if (from === Contests.MultiSkish && to === Contests.MultiDistance)
		return "2-bój multi";
	if (
		from === Contests.FlyDistanceDoubleHand &&
		to === Contests.DistanceDoubleHand
	)
		return "2-bój odległościowy";
	return `${to - from + 1}-bój`;
};

export const getThlonEnumName = (
	from: number,
	to: number,
): keyof typeof Thlon => {
	if (from === Contests.MultiSkish && to === Contests.MultiDistance)
		return "multi";
	if (
		from === Contests.FlyDistanceDoubleHand &&
		to === Contests.DistanceDoubleHand
	)
		return "distance";
	if (from === Contests.Arenberg && to === Contests.Distance) return "3boj";
	if (from === Contests.FlySkish && to === Contests.Distance) return "5boj";
	if (from === Contests.FlySkish && to === Contests.DistanceDoubleHand)
		return "7boj";
	return "9boj";
};
