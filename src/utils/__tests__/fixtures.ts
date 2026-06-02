import { Contests, type Contest, type Contestant } from "@/types/Contestant";

export const makeContest = (id: Contests, overrides: Partial<Contest> = {}): Contest => ({
	id,
	takesPart: true,
	score: 0,
	total: 0,
	...overrides,
});

export const makeContestant = (overrides: Partial<Contestant> = {}): Contestant => ({
	id: "c1",
	name: "Test Zawodnik",
	number: 1,
	club: "KW",
	category: "Mężczyzna",
	girl: false,
	contests: Object.values(Contests)
		.filter((v): v is Contests => typeof v === "number")
		.map((id) => makeContest(id)),
	...overrides,
});

export const withContest = (
	contestant: Contestant,
	contestId: Contests,
	overrides: Partial<Contest>,
): Contestant => ({
	...contestant,
	contests: contestant.contests.map((c) =>
		c.id === contestId ? { ...c, ...overrides } : c,
	),
});
