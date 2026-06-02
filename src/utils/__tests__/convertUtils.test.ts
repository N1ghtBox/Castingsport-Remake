import { describe, expect, it } from "vitest";
import { Categories, Contests } from "@/types/Contestant";
import { AddPlace, AddTotal, GenerateThlonResults, TimeToSeconds } from "../convertUtils";
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
