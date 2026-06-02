import { describe, expect, it } from "vitest";
import { SeriesTypes } from "@/types/Series";
import {
	sortByContestWithDoubleScore,
	sortByContestWithTime,
	sortByTotal,
	sortSeriesResults,
} from "../sortUtils";

describe("sortByContestWithTime", () => {
	it("higher score wins", () => {
		expect(sortByContestWithTime({ score: 10, time: "01.00.000" }, { score: 5, time: "00.30.000" })).toBeLessThan(0);
	});

	it("equal score: lower time wins (ascending)", () => {
		const faster = { score: 10, time: "00.30.000" };
		const slower = { score: 10, time: "01.00.000" };
		expect(sortByContestWithTime(faster, slower)).toBeLessThan(0);
	});

	it("equal score and time → 0", () => {
		const a = { score: 5, time: "00.30.000" };
		expect(sortByContestWithTime(a, a)).toBe(0);
	});

	it("missing time treated as 00.00.000", () => {
		const noTime = { score: 5 };
		const withTime = { score: 5, time: "00.01.000" };
		// noTime has time 0 (faster), so noTime should rank before withTime
		expect(sortByContestWithTime(noTime, withTime)).toBeLessThan(0);
	});
});

describe("sortByContestWithDoubleScore", () => {
	it("higher combined score wins", () => {
		const a = { score: 5, second_score: 5 };  // 10
		const b = { score: 3, second_score: 3 };  // 6
		expect(sortByContestWithDoubleScore(a, b)).toBeLessThan(0);
	});

	it("equal combined → 0", () => {
		const a = { score: 5, second_score: 5 };
		expect(sortByContestWithDoubleScore(a, a)).toBe(0);
	});
});

describe("sortByTotal", () => {
	it("higher total first", () => {
		expect(sortByTotal({ total: 100 }, { total: 50 })).toBeLessThan(0);
	});

	it("equal → 0", () => {
		expect(sortByTotal({ total: 50 }, { total: 50 })).toBe(0);
	});
});

describe("sortSeriesResults", () => {
	const mkEntry = (place: number, total: number) => ({ place, total });

	it("Puchar: lower place wins when places differ", () => {
		const a = mkEntry(1, 10);
		const b = mkEntry(2, 99);
		expect(sortSeriesResults(SeriesTypes.puchar)(a, b)).toBeLessThan(0);
	});

	it("Puchar: equal place falls back to total descending", () => {
		const a = mkEntry(1, 99);
		const b = mkEntry(1, 10);
		expect(sortSeriesResults(SeriesTypes.puchar)(a, b)).toBeLessThan(0);
	});

	it("Tury: total descending regardless of place", () => {
		const a = mkEntry(5, 99);
		const b = mkEntry(1, 10);
		expect(sortSeriesResults(SeriesTypes.tury)(a, b)).toBeLessThan(0);
	});
});
