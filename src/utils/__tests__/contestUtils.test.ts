import { describe, expect, it } from "vitest";
import { Contests, Thlon } from "@/types/Contestant";
import {
	GetContestResult,
	GetThlonResult,
	GetThlonResultFromThlon,
	getThlonEnumName,
	getThlonName,
	TakesPartInContest,
	TakesPartInContests,
	TakesPartInThlon,
	TypeOfContest,
} from "../contestUtils";
import { makeContest, makeContestant, withContest } from "./fixtures";

describe("GetThlonResult", () => {
	it("sums only contests within the given range", () => {
		const c = makeContestant({
			contests: [
				makeContest(Contests.Arenberg, { total: 10 }), // 3
				makeContest(Contests.Skish, { total: 20 }), // 4
				makeContest(Contests.Distance, { total: 15 }), // 5
				makeContest(Contests.FlySkish, { total: 100 }), // 1 — out of range
			],
		});
		expect(GetThlonResult(c, 3, 5)).toBe(45);
	});

	it("rounds to 2 decimal places", () => {
		const c = makeContestant({
			contests: [
				makeContest(Contests.Arenberg, { total: 10.333 }),
				makeContest(Contests.Skish, { total: 10.333 }),
				makeContest(Contests.Distance, { total: 10.334 }),
			],
		});
		expect(GetThlonResultFromThlon(c, '3boj')).toBe(31);
	});

	it("returns 0 when no contests in range", () => {
		const c = makeContestant({
			contests: [makeContest(Contests.FlySkish, { total: 50 })],
		});
		expect(GetThlonResultFromThlon(c, '3boj')).toBe(0);
	});
});

describe("GetThlonResultFromThlon", () => {
	it("matches GetThlonResult with explicit from/to", () => {
		const c = makeContestant({
			contests: [
				makeContest(Contests.Arenberg, { total: 10 }),
				makeContest(Contests.Skish, { total: 20 }),
				makeContest(Contests.Distance, { total: 15 }),
			],
		});
		const expected = GetThlonResult(c, Thlon["3boj"].from, Thlon["3boj"].to);
		expect(GetThlonResultFromThlon(c, "3boj")).toBe(expected);
	});
});

describe("GetContestResult", () => {
	it("double: sums score and second_score", () => {
		const c = makeContest(Contests.FlyDistance, { score: 5, second_score: 3 });
		expect(GetContestResult(c)).toBe(8);
	});

	it("double: treats missing second_score as 0", () => {
		const c = makeContest(Contests.FlyDistance, { score: 5 });
		expect(GetContestResult(c)).toBe(5);
	});

	it("time: returns score only", () => {
		const c = makeContest(Contests.Skish, { score: 7 });
		expect(GetContestResult(c)).toBe(7);
	});

	it("single: multiplies score by 1.5", () => {
		const c = makeContest(Contests.Distance, { score: 6 });
		expect(GetContestResult(c)).toBe(9);
	});
});

describe("TypeOfContest", () => {
	it.each([
		[Contests.FlySkish, "time"],
		[Contests.FlyDistance, "double"],
		[Contests.Arenberg, "time"],
		[Contests.Skish, "time"],
		[Contests.Distance, "single"],
		[Contests.FlyDistanceDoubleHand, "double"],
		[Contests.DistanceDoubleHand, "single"],
		[Contests.MultiSkish, "time"],
		[Contests.MultiDistance, "single"],
	] as const)("contest %i → %s", (id, expected) => {
		expect(TypeOfContest(id)).toBe(expected);
	});
});

describe("TakesPartInThlon", () => {
	it("returns true when all contests in range have takesPart=true", () => {
		const c = makeContestant();
		expect(TakesPartInThlon(c, "3boj")).toBe(true);
	});

	it("returns false when one contest in range has takesPart=false", () => {
		const c = withContest(makeContestant(), Contests.Arenberg, {
			takesPart: false,
		});
		expect(TakesPartInThlon(c, "3boj")).toBe(false);
	});
});

describe("TakesPartInContests", () => {
	it("returns true with explicit range when all participate", () => {
		expect(TakesPartInContests(makeContestant(), 3, 5)).toBe(true);
	});

	it("returns false when missing contestant in range", () => {
		const c = withContest(makeContestant(), Contests.Skish, {
			takesPart: false,
		});
		expect(TakesPartInContests(c, 3, 5)).toBe(false);
	});
});

describe("TakesPartInContest", () => {
	it("returns true when contest has takesPart=true", () => {
		expect(TakesPartInContest(makeContestant(), Contests.Arenberg)).toBe(true);
	});

	it("returns false when contest has takesPart=false", () => {
		const c = withContest(makeContestant(), Contests.Arenberg, {
			takesPart: false,
		});
		expect(TakesPartInContest(c, Contests.Arenberg)).toBe(false);
	});
});

describe("getThlonName", () => {
	it("2-bój multi", () => {
		expect(getThlonName(Contests.MultiSkish, Contests.MultiDistance)).toBe(
			"2-bój multi",
		);
	});

	it("2-bój odległościowy", () => {
		expect(
			getThlonName(Contests.FlyDistanceDoubleHand, Contests.DistanceDoubleHand),
		).toBe("2-bój odległościowy");
	});

	it("N-bój fallback", () => {
		expect(getThlonName(3, 5)).toBe("3-bój");
		expect(getThlonName(1, 9)).toBe("9-bój");
	});
});

describe("getThlonEnumName", () => {
	it.each(
		Object.entries(Thlon) as [
			keyof typeof Thlon,
			{ from: number; to: number },
		][],
	)("round-trips %s", (key, { from, to }) => {
		expect(getThlonEnumName(from, to)).toBe(key);
	});
});
