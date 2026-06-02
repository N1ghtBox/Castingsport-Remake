import { describe, expect, it } from "vitest";
import { Categories, Contests, Thlon } from "@/types/Contestant";
import {
	ByContestantCategory,
	ByContestantCategoryInThlon,
	ByTakesPartInThlon,
	chainFilters,
} from "../filterUtils";
import { makeContestant, withContest } from "./fixtures";

describe("chainFilters", () => {
	const alwaysTrue = () => true;
	const alwaysFalse = () => false;

	it("returns true when all filters pass", () => {
		expect(chainFilters(alwaysTrue, alwaysTrue)(null)).toBe(true);
	});

	it("returns false when any filter fails", () => {
		expect(chainFilters(alwaysTrue, alwaysFalse)(null)).toBe(false);
	});
});

describe("ByTakesPartInThlon", () => {
	it("returns true when contestant participates in all thlon contests", () => {
		const c = makeContestant();
		expect(ByTakesPartInThlon(Thlon["3boj"])(c)).toBe(true);
	});

	it("returns false when one contest missing", () => {
		const c = withContest(makeContestant(), Contests.Skish, { takesPart: false });
		expect(ByTakesPartInThlon(Thlon["3boj"])(c)).toBe(false);
	});
});

describe("ByContestantCategory", () => {
	it("returns true for any category when filter is undefined", () => {
		const c = makeContestant({ category: Categories.Kadet });
		expect(ByContestantCategory(undefined, Contests.Arenberg)(c)).toBe(true);
	});

	it("Kadet boy in FlySkish → reclassified as Junior", () => {
		const c = makeContestant({ category: Categories.Kadet, girl: false });
		expect(ByContestantCategory(Categories.Junior, Contests.FlySkish)(c)).toBe(true);
		expect(ByContestantCategory(Categories.Kadet, Contests.FlySkish)(c)).toBe(false);
	});

	it("Kadet girl in FlySkish → reclassified as Juniorka", () => {
		const c = makeContestant({ category: Categories.Kadet, girl: true });
		expect(ByContestantCategory(Categories.Juniorka, Contests.FlySkish)(c)).toBe(true);
	});

	it("Kadet boy in MultiSkish → reclassified to Man", () => {
		const c = makeContestant({ category: Categories.Kadet, girl: false });
		expect(ByContestantCategory(Categories.Man, Contests.MultiSkish)(c)).toBe(true);
	});

	it("Kadet girl in MultiSkish → reclassified to Kobieta", () => {
		const c = makeContestant({ category: Categories.Kadet, girl: true });
		expect(ByContestantCategory(Categories.Kobieta, Contests.MultiSkish)(c)).toBe(true);
	});

	it("Junior in MultiSkish → reclassified to Man", () => {
		const c = makeContestant({ category: Categories.Junior });
		expect(ByContestantCategory(Categories.Man, Contests.MultiSkish)(c)).toBe(true);
	});

	it("Man in Arenberg stays Man (no remapping)", () => {
		const c = makeContestant({ category: Categories.Man });
		expect(ByContestantCategory(Categories.Man, Contests.Arenberg)(c)).toBe(true);
		expect(ByContestantCategory(Categories.Junior, Contests.Arenberg)(c)).toBe(false);
	});
});

describe("ByContestantCategoryInThlon", () => {
	it("returns true for any category when filter is undefined", () => {
		const c = makeContestant({ category: Categories.Kadet });
		expect(ByContestantCategoryInThlon(undefined, Thlon["3boj"])(c)).toBe(true);
	});

	it("3boj: Kadet stays Kadet (from=3 not <= FlyDistance=2)", () => {
		const c = makeContestant({ category: Categories.Kadet, girl: false });
		expect(ByContestantCategoryInThlon(Categories.Kadet, Thlon["3boj"])(c)).toBe(true);
		expect(ByContestantCategoryInThlon(Categories.Junior, Thlon["3boj"])(c)).toBe(false);
	});

	it("5boj: Kadet boy → Junior", () => {
		const c = makeContestant({ category: Categories.Kadet, girl: false });
		expect(ByContestantCategoryInThlon(Categories.Junior, Thlon["5boj"])(c)).toBe(true);
	});

	it("5boj: Kadet girl → Juniorka", () => {
		const c = makeContestant({ category: Categories.Kadet, girl: true });
		expect(ByContestantCategoryInThlon(Categories.Juniorka, Thlon["5boj"])(c)).toBe(true);
	});

	it("7boj: Junior → Man (to=7 > Distance=5)", () => {
		const c = makeContestant({ category: Categories.Junior });
		expect(ByContestantCategoryInThlon(Categories.Man, Thlon["7boj"])(c)).toBe(true);
	});

	it("7boj: Juniorka → Kobieta", () => {
		const c = makeContestant({ category: Categories.Juniorka });
		expect(ByContestantCategoryInThlon(Categories.Kobieta, Thlon["7boj"])(c)).toBe(true);
	});

	it("9boj: Kadet boy → Man", () => {
		const c = makeContestant({ category: Categories.Kadet, girl: false });
		expect(ByContestantCategoryInThlon(Categories.Man, Thlon["9boj"])(c)).toBe(true);
	});

	it("9boj: Kadet girl → Kobieta", () => {
		const c = makeContestant({ category: Categories.Kadet, girl: true });
		expect(ByContestantCategoryInThlon(Categories.Kobieta, Thlon["9boj"])(c)).toBe(true);
	});
});
