import { describe, expect, it } from "vitest";
import { Categories, Contests } from "@/types/Contestant";
import { AddDefaultSubcategories, AddPlace, AddTotal, GenerateThlonResults, TimeToSeconds } from "../convertUtils";
import { makeContest, makeContestant, withContest } from "./fixtures";

describe("TimeToSeconds", () => {
	it("converts mm.ss.ms correctly", () => {
		expect(TimeToSeconds("01.30.500")).toBe(90.5);
	});

	it("zero", () => {
		expect(TimeToSeconds("00.00.000")).toBe(0);
	});

	it("minutes only", () => {
		expect(TimeToSeconds("02.00.000")).toBe(120);
	});
});

describe("AddTotal", () => {
	it("adds total equal to GetThlonResult for given thlon range", () => {
		const c = makeContestant({
			contests: [
				makeContest(Contests.Arenberg, { total: 10 }),
				makeContest(Contests.Skish, { total: 20 }),
				makeContest(Contests.Distance, { total: 15 }),
			],
		});
		const result = AddTotal({ from: 3, to: 5 })(c);
		expect(result.total).toBe(45);
	});
});

describe("AddPlace", () => {
	it("assigns place = index + 1", () => {
		expect(AddPlace({ name: "A" }, 0).place).toBe(1);
		expect(AddPlace({ name: "B" }, 4).place).toBe(5);
	});
});

describe("GenerateThlonResults", () => {
	const thlon = { from: 3, to: 5 };

	const mkContestant = (id: string, total: number) =>
		makeContestant({
			id,
			name: id,
			category: Categories.Man,
			contests: [
				makeContest(Contests.Arenberg, { total, takesPart: true }),
				makeContest(Contests.Skish, { total: 0, takesPart: true }),
				makeContest(Contests.Distance, { total: 0, takesPart: true }),
			],
		});

	it("sorts by total descending and assigns places", () => {
		const contestants = [mkContestant("B", 20), mkContestant("A", 30)];
		const results = GenerateThlonResults(contestants, Categories.Man, thlon);
		expect(results[0].name).toBe("A");
		expect(results[0].place).toBe(1);
		expect(results[1].name).toBe("B");
		expect(results[1].place).toBe(2);
	});

	it("ignores subcategories when the 4th arg is omitted", () => {
		const contestants = [mkContestant("B", 20), mkContestant("A", 30)];
		const results = GenerateThlonResults(contestants, Categories.Man, thlon);
		expect(results.map((r) => r.name)).toEqual(["A", "B"]);
	});

	it("filters by subcategory and renumbers places from 1", () => {
		const withSub = (id: string, total: number, subcategories: string[]) => ({
			...mkContestant(id, total),
			subcategories,
		});
		const contestants = [
			withSub("EU", 50, ["sub-eu"]),
			withSub("PL1", 30, ["sub-pl", "sub-eu"]),
			withSub("PL2", 20, ["sub-pl", "sub-eu"]),
		];

		const polish = GenerateThlonResults(contestants, Categories.Man, thlon, "sub-pl");
		expect(polish.map((r) => [r.name, r.place])).toEqual([
			["PL1", 1],
			["PL2", 2],
		]);

		const european = GenerateThlonResults(contestants, Categories.Man, thlon, "sub-eu");
		expect(european.map((r) => [r.name, r.place])).toEqual([
			["EU", 1],
			["PL1", 2],
			["PL2", 3],
		]);
	});

	it("filters out non-participants", () => {
		const nonParticipant = withContest(mkContestant("C", 50), Contests.Arenberg, { takesPart: false });
		const contestants = [mkContestant("A", 30), nonParticipant];
		const results = GenerateThlonResults(contestants, Categories.Man, thlon);
		expect(results.map((r) => r.name)).not.toContain("C");
	});

	it("filters by category", () => {
		const woman = makeContestant({
			id: "W",
			name: "W",
			category: Categories.Kobieta,
			contests: [
				makeContest(Contests.Arenberg, { total: 99, takesPart: true }),
				makeContest(Contests.Skish, { takesPart: true }),
				makeContest(Contests.Distance, { takesPart: true }),
			],
		});
		const results = GenerateThlonResults(
			[mkContestant("A", 30), woman],
			Categories.Man,
			thlon,
		);
		expect(results.map((r) => r.name)).not.toContain("W");
	});

	it("returns empty when no contestants match", () => {
		expect(GenerateThlonResults([], Categories.Man, thlon)).toEqual([]);
	});
});

describe("AddDefaultSubcategories", () => {
	const subs = [
		{ id: "sub-pl", name: "Mistrzostwa Polski" },
		{ id: "sub-eu", name: "Open European Cup" },
	];

	it("leaves contestants untouched when the competition has no subcategories", () => {
		const c = makeContestant();
		expect(AddDefaultSubcategories(undefined)(c).subcategories).toBeUndefined();
		expect(AddDefaultSubcategories([])(c).subcategories).toBeUndefined();
	});

	it("puts a legacy contestant into every subcategory", () => {
		const c = makeContestant({ subcategories: undefined });
		expect(AddDefaultSubcategories(subs)(c).subcategories).toEqual(["sub-pl", "sub-eu"]);
	});

	it("preserves an explicit empty assignment", () => {
		const c = makeContestant({ subcategories: [] });
		expect(AddDefaultSubcategories(subs)(c).subcategories).toEqual([]);
	});

	it("preserves an existing assignment", () => {
		const c = makeContestant({ subcategories: ["sub-eu"] });
		expect(AddDefaultSubcategories(subs)(c).subcategories).toEqual(["sub-eu"]);
	});
});
