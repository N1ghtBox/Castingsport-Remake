import { describe, expect, it } from "vitest";
import { Categories, Contests, Thlon } from "@/types/Contestant";
import {
	ByContestantCategory,
	ByContestantCategoryInThlon,
	BySubcategory,
	ByTakesPartInThlon,
	ByTeamSubcategory,
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

describe("BySubcategory", () => {
	const polish = "sub-pl";
	const european = "sub-eu";

	it("passes everyone when no subcategory is selected (legacy competitions)", () => {
		const c = makeContestant({ subcategories: undefined });
		expect(BySubcategory(undefined)(c)).toBe(true);
	});

	it("passes a contestant assigned to the selected subcategory", () => {
		const c = makeContestant({ subcategories: [polish, european] });
		expect(BySubcategory(polish)(c)).toBe(true);
	});

	it("rejects a contestant not assigned to the selected subcategory", () => {
		const c = makeContestant({ subcategories: [european] });
		expect(BySubcategory(polish)(c)).toBe(false);
	});

	it("rejects a contestant with no subcategories when one is selected", () => {
		expect(BySubcategory(polish)(makeContestant({ subcategories: undefined }))).toBe(false);
		expect(BySubcategory(polish)(makeContestant({ subcategories: [] }))).toBe(false);
	});
});

describe("ByTeamSubcategory", () => {
	const polish = "sub-pl";
	const european = "sub-eu";
	const both = makeContestant({ id: "a", subcategories: [polish, european] });
	const euOnly = makeContestant({ id: "b", subcategories: [european] });
	const contestants = [both, euOnly];

	it("passes every team when no subcategory is selected", () => {
		expect(ByTeamSubcategory(undefined, contestants)({ members: ["a", "b"] })).toBe(true);
	});

	it("passes when every member is eligible", () => {
		expect(ByTeamSubcategory(european, contestants)({ members: ["a", "b"] })).toBe(true);
		expect(ByTeamSubcategory(polish, contestants)({ members: ["a"] })).toBe(true);
	});

	it("rejects when any member is not eligible", () => {
		expect(ByTeamSubcategory(polish, contestants)({ members: ["a", "b"] })).toBe(false);
	});

	it("rejects when a member id cannot be resolved", () => {
		expect(ByTeamSubcategory(polish, contestants)({ members: ["a", "ghost"] })).toBe(false);
	});
});
