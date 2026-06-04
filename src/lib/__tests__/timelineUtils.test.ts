import moment from "moment";
import { describe, expect, it } from "vitest";
import type { OrderConfig, TimeConfig } from "@/types/Competition";
import { Contests } from "@/types/Contestant";
import type { TimelineContestant, TimelineData } from "@/types/TimelineData";
import { EVENT_ORDER, generateTimeline, getEventOrder } from "../timelineUtils";

// --- helpers ---

const makeContestants = (count: number): TimelineContestant[] =>
	Array.from({ length: count }, (_, i) => ({
		order: i + 1,
		name: `C${i + 1}`,
		number: i + 1,
		category: "Mężczyzna" as const,
		club: "Club",
	}));

const emptyData = (): TimelineData => {
	const data: Partial<TimelineData> = {};
	Object.values(Contests)
		.filter((v): v is number => typeof v === "number")
		.forEach((c) => {
			data[c] = {};
		});
	return data as TimelineData;
};

const withContestants = (
	base: TimelineData,
	contest: Contests,
	count: number,
): TimelineData => ({
	...base,
	[contest]: { 1: makeContestants(count) },
});

const startOfDay = () => moment("2024-01-01T00:00:00");

const defaultOrder: OrderConfig = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9 };

// --- getEventOrder ---

describe("getEventOrder", () => {
	it("returns EVENT_ORDER when orderConfig is null", () => {
		expect(getEventOrder(null as unknown as OrderConfig)).toEqual(EVENT_ORDER);
	});

	it("returns EVENT_ORDER when orderConfig is empty", () => {
		expect(getEventOrder({} as OrderConfig)).toEqual(EVENT_ORDER);
	});

	it("returns contests sorted by slot key", () => {
		const config: OrderConfig = {
			1: Contests.Distance,
			2: Contests.FlySkish,
			3: Contests.Arenberg,
		};
		expect(getEventOrder(config)).toEqual([
			Contests.Distance,
			Contests.FlySkish,
			Contests.Arenberg,
		]);
	});

	it("handles non-sequential slot keys", () => {
		const config: OrderConfig = {
			3: Contests.Skish,
			1: Contests.MultiDistance,
			2: Contests.Arenberg,
		};
		expect(getEventOrder(config)).toEqual([
			Contests.MultiDistance,
			Contests.Arenberg,
			Contests.Skish,
		]);
	});
});

// --- generateTimeline: first contest ---

describe("generateTimeline — first contest", () => {
	it("defaults first contest to 09:00 when no timeConfig", () => {
		const timeline = generateTimeline(startOfDay(), emptyData(), {}, defaultOrder);
		expect(timeline[Contests.FlySkish]?.format("HH:mm")).toBe("09:00");
	});

	it("uses timeConfig overwrite for first contest", () => {
		const timeConfig: TimeConfig = {
			[Contests.FlySkish]: moment("2024-01-01T11:30:00"),
		};
		const timeline = generateTimeline(startOfDay(), emptyData(), timeConfig, defaultOrder);
		expect(timeline[Contests.FlySkish]?.format("HH:mm")).toBe("11:30");
	});

	it("first contest is order[0], not hardcoded FlySkish", () => {
		const order: OrderConfig = {
			1: Contests.Distance,
			2: Contests.FlySkish,
			3: Contests.Arenberg,
		};
		const timeline = generateTimeline(startOfDay(), emptyData(), {}, order);
		expect(timeline[Contests.Distance]?.format("HH:mm")).toBe("09:00");
	});

	it("does not mutate startOfEvent", () => {
		const start = moment("2024-01-01T08:00:00");
		const clone = start.clone();
		generateTimeline(start, emptyData(), {}, defaultOrder);
		expect(start.isSame(clone)).toBe(true);
	});
});

// --- generateTimeline: subsequent contests ---

describe("generateTimeline — subsequent contests", () => {
	it("calculates next contest from end of previous when no overwrite (empty data → same time)", () => {
		const timeline = generateTimeline(startOfDay(), emptyData(), {}, defaultOrder);
		// empty data → calculateEndOfEvent returns startOfEvent → all stack at 09:00
		expect(timeline[Contests.FlyDistance]?.format("HH:mm")).toBe("09:00");
	});

	it("uses timeConfig overwrite for subsequent contest", () => {
		const timeConfig: TimeConfig = {
			[Contests.FlyDistance]: moment("2024-01-01T13:00:00"),
		};
		const timeline = generateTimeline(startOfDay(), emptyData(), timeConfig, defaultOrder);
		expect(timeline[Contests.FlyDistance]?.format("HH:mm")).toBe("13:00");
	});

	it("overwrite in middle is used as base for next calculation", () => {
		// FlySkish at 09:00, FlyDistance overwritten to 14:00
		// Arenberg calculated from FlyDistance(14:00) end with empty data → also 14:00
		const order: OrderConfig = {
			1: Contests.FlySkish,
			2: Contests.FlyDistance,
			3: Contests.Arenberg,
		};
		const timeConfig: TimeConfig = {
			[Contests.FlyDistance]: moment("2024-01-01T14:00:00"),
		};
		const timeline = generateTimeline(startOfDay(), emptyData(), timeConfig, order);
		expect(timeline[Contests.FlyDistance]?.format("HH:mm")).toBe("14:00");
		expect(timeline[Contests.Arenberg]?.format("HH:mm")).toBe("14:00");
	});

	it("all contests get a time entry", () => {
		const timeline = generateTimeline(startOfDay(), emptyData(), {}, defaultOrder);
		Object.values(defaultOrder).forEach((contest) => {
			expect(timeline[contest]).toBeDefined();
		});
	});
});

// --- generateTimeline: time rounding ---

describe("generateTimeline — time rounding via contestant count", () => {
	it("2 contestants on FlySkish (28 min) → next rounds to :30", () => {
		// 2 * (3+1) + 20 = 28 min → 09:28 → round to 09:30
		const order: OrderConfig = { 1: Contests.FlySkish, 2: Contests.FlyDistance };
		const data = withContestants(emptyData(), Contests.FlySkish, 2);
		const timeline = generateTimeline(startOfDay(), data, {}, order);
		expect(timeline[Contests.FlyDistance]?.format("HH:mm")).toBe("09:30");
	});

	it("5 contestants on FlySkish (40 min) → next rounds to next hour", () => {
		// 5 * (3+1) + 20 = 40 min → 09:40 → round to 10:00
		const order: OrderConfig = { 1: Contests.FlySkish, 2: Contests.FlyDistance };
		const data = withContestants(emptyData(), Contests.FlySkish, 5);
		const timeline = generateTimeline(startOfDay(), data, {}, order);
		expect(timeline[Contests.FlyDistance]?.format("HH:mm")).toBe("10:00");
	});

	it("exact 30-min boundary (5 contestants on Distance: 5*(3+1)+20=40) → next hour", () => {
		// Distance: EventTimeConfig = 3, same formula
		// 5 * (3+1) + 20 = 40 → 09:40 → 10:00
		const order: OrderConfig = { 1: Contests.Distance, 2: Contests.FlySkish };
		const data = withContestants(emptyData(), Contests.Distance, 5);
		const timeline = generateTimeline(startOfDay(), data, {}, order);
		expect(timeline[Contests.FlySkish]?.format("HH:mm")).toBe("10:00");
	});

	it("10 contestants on FlySkish (60 min, exact hour) → next stays on hour", () => {
		// 10 * (3+1) + 20 = 60 min → 10:00 → minutes=0 → stays 10:00
		const order: OrderConfig = { 1: Contests.FlySkish, 2: Contests.FlyDistance };
		const data = withContestants(emptyData(), Contests.FlySkish, 10);
		const timeline = generateTimeline(startOfDay(), data, {}, order);
		expect(timeline[Contests.FlyDistance]?.format("HH:mm")).toBe("10:00");
	});
});

// --- generateTimeline: custom order ---

describe("generateTimeline — custom contest order", () => {
	it("FlySkish not first: Distance starts at 09:00, FlySkish calculated after", () => {
		const order: OrderConfig = {
			1: Contests.Distance,
			2: Contests.FlySkish,
		};
		const timeline = generateTimeline(startOfDay(), emptyData(), {}, order);
		expect(timeline[Contests.Distance]?.format("HH:mm")).toBe("09:00");
		expect(timeline[Contests.FlySkish]?.format("HH:mm")).toBe("09:00");
	});

	it("timeConfig overwrite on non-first FlySkish works correctly", () => {
		const order: OrderConfig = {
			1: Contests.Distance,
			2: Contests.FlySkish,
			3: Contests.Arenberg,
		};
		const timeConfig: TimeConfig = {
			[Contests.FlySkish]: moment("2024-01-01T12:00:00"),
		};
		const timeline = generateTimeline(startOfDay(), emptyData(), timeConfig, order);
		expect(timeline[Contests.Distance]?.format("HH:mm")).toBe("09:00");
		expect(timeline[Contests.FlySkish]?.format("HH:mm")).toBe("12:00");
		expect(timeline[Contests.Arenberg]?.format("HH:mm")).toBe("12:00");
	});
});
