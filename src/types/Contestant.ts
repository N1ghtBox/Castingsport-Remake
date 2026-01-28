import type { TeamCategory } from "./Teams";

export type Contestant = {
	id: string;
	name: string;
	number: number;
	club: string;
	category: CategoryValues;
	girl: boolean
	contests: Array<Contest>;
};

export type EditableContestant = Contestant & { isNew: boolean }

export type Contest = {
	takesPart: boolean;
	score: number;
	second_score?: number;
	total: number;
	time?: string;
	id: Contests;
};

export enum Contests {
	FlySkish = 1,
	FlyDistance = 2,
	Arenberg = 3,
	Skish = 4,
	Distance = 5,
	FlyDistanceDoubleHand = 6,
	DistanceDoubleHand = 7,
	MultiSkish = 8,
	MultiDistance = 9,
}

export const ContestNames: Map<Contests, string> = new Map([
	[Contests.Arenberg, "Arenberg"],
	[Contests.FlyDistance, "Mucha odlegość"],
	[Contests.FlyDistanceDoubleHand, "Mucha odlegość oburącz"],
	[Contests.Skish, "Skish"],
	[Contests.FlySkish, "Mucha cel"],
	[Contests.MultiSkish, "Multi skish"],
	[Contests.MultiDistance, "Multi odległość"],
	[Contests.DistanceDoubleHand, "Odległość oburącz"],
	[Contests.Distance, "Odległość 7.5g"],
]);

export const Thlon = {
	"3boj": { from: 3, to: 5 },
	"5boj": { from: 1, to: 5 },
	"7boj": { from: 1, to: 7 },
	"9boj": { from: 1, to: 9 },
	multi: { from: 8, to: 9 },
	distance: { from: 6, to: 7 },
} as const;

export const Categories = {
	Unknown: "Unknown",
	Kadet: "Kadet",
	Junior: "Junior",
	Juniorka: "Juniorka",
	Man: "Open",
	Kobieta: "Kobieta",
} as const;

export type CategoryValues = (typeof Categories)[keyof typeof Categories];

export type TeamCategoryValues =
	(typeof TeamCategory)[keyof typeof TeamCategory];
