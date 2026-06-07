import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Competition } from "@/types/Competition";
import type { CompetitionJsonData } from "@/types/JsonData";
import type { GeneralListsJson } from "@/types/JsonData";
import { SeriesTypes, type Series } from "@/types/Series";
import { Contests } from "@/types/Contestant";
import { TeamCategory, type Team } from "@/types/Teams";
import { getCompData, getCompetitionInfo, getGeneralData, updateGeneralData } from "@/utils/jsonUtils";
import {
	calculateSerieScores,
	calculateSerieTeamScores,
	createSeries,
	getSerieData,
	updateSeries,
} from "../seriesUtils";
import { makeContestant, withContest } from "./fixtures";

beforeEach(() => vi.clearAllMocks());

vi.mock("p-limit", () => ({ default: () => (fn: () => Promise<unknown>) => fn() }));
vi.mock("uuid", () => ({ v4: () => "test-uuid", v7: () => "test-uuid-v7" }));
vi.mock("@/providers/LoggingProvider/LoggingProvider", () => ({
	LoggingProvider: { LogData: vi.fn(), LogWarning: vi.fn(), LogInfo: vi.fn(), LogException: vi.fn() },
}));
vi.mock("@/utils/jsonUtils", () => ({
	getCompData: vi.fn(),
	getCompetitionInfo: vi.fn(),
	getGeneralData: vi.fn(),
	updateGeneralData: vi.fn(),
}));

// --- helpers ---

const set3boj = (base = makeContestant(), arenberg = 0, skish = 0, distance = 0) =>
	withContest(
		withContest(
			withContest(base, Contests.Arenberg, { total: arenberg }),
			Contests.Skish, { total: skish },
		),
		Contests.Distance, { total: distance },
	);

const set5boj = (base = makeContestant(), totalPerContest = 0) => {
	let c = base;
	for (const id of [Contests.FlySkish, Contests.FlyDistance, Contests.Arenberg, Contests.Skish, Contests.Distance]) {
		c = withContest(c, id, { total: totalPerContest });
	}
	return c;
};

const makeSerie = (overrides: Partial<Series> = {}): Series => ({
	id: "s1",
	name: "Test Serie",
	competitionIds: ["comp1", "comp2"],
	year: 2024,
	type: SeriesTypes.puchar,
	...overrides,
});

const makeTeam = (overrides: Partial<Team> = {}): Team => ({
	id: "t1",
	name: "TeamA",
	category: TeamCategory.Senior,
	members: [],
	memberNames: [],
	...overrides,
});

const compInfo = (name: string) => ({ name } as Competition);

// --- getSerieData ---

describe("getSerieData", () => {
	it("returns series when found", async () => {
		const serie = makeSerie();
		vi.mocked(getGeneralData).mockResolvedValue({ series: [serie], competitions: [] } as GeneralListsJson);
		expect(await getSerieData("s1")).toEqual(serie);
	});

	it("returns undefined when not found", async () => {
		vi.mocked(getGeneralData).mockResolvedValue({ series: [], competitions: [] } as GeneralListsJson);
		expect(await getSerieData("missing")).toBeUndefined();
	});
});

// --- updateSeries ---

describe("updateSeries", () => {
	beforeEach(() => {
		vi.mocked(updateGeneralData).mockResolvedValue(undefined);
	});

	it("updates fields when series exists", async () => {
		const existing = makeSerie();
		const contents = { series: [existing], competitions: [] } as GeneralListsJson;
		vi.mocked(getGeneralData).mockResolvedValue(contents);

		await updateSeries("s1", { ...existing, name: "Updated" });

		expect(vi.mocked(updateGeneralData)).toHaveBeenCalled();
		expect(contents.series[0].name).toBe("Updated");
	});

	it("does not call updateGeneralData when series not found", async () => {
		vi.mocked(getGeneralData).mockResolvedValue({ series: [], competitions: [] } as GeneralListsJson);
		await updateSeries("missing", makeSerie());
		expect(vi.mocked(updateGeneralData)).not.toHaveBeenCalled();
	});
});

// --- createSeries ---

describe("createSeries", () => {
	it("pushes new series and returns its id", async () => {
		const contents = { series: [], competitions: [] } as GeneralListsJson;
		vi.mocked(getGeneralData).mockResolvedValue(contents);
		vi.mocked(updateGeneralData).mockResolvedValue(undefined);

		const id = await createSeries({ name: "New", competitionIds: [], year: 2024, type: SeriesTypes.puchar });

		expect(id).toBe("test-uuid");
		expect(contents.series).toHaveLength(1);
		expect(contents.series[0].id).toBe("test-uuid");
		expect(contents.series[0].name).toBe("New");
	});
});

// --- calculateSerieScores ---

describe("calculateSerieScores", () => {
	it("single contestant in one comp → one placement", async () => {
		const adam = set3boj(makeContestant({ id: "adam", name: "Adam" }), 10, 10, 10);
		vi.mocked(getCompData).mockResolvedValue({ name: "CompA", contestants: [adam], teams: [] } as CompetitionJsonData);

		const result = await calculateSerieScores(makeSerie({ competitionIds: ["comp1"] }));

		const adamResult = result["3boj"].find((r) => r.name === "Adam");
		expect(adamResult).toBeDefined();
		expect(adamResult?.placements).toHaveLength(1);
		expect(adamResult?.placements[0].score).toBe(30);
	});

	it("contestant in two comps → placements aggregated", async () => {
		const adamComp1 = set3boj(makeContestant({ id: "adam", name: "Adam" }), 10, 10, 10); // 30
		const adamComp2 = set3boj(makeContestant({ id: "adam", name: "Adam" }), 8, 8, 9);   // 25

		vi.mocked(getCompData).mockImplementation(async (id) =>
			id === "comp1"
				? ({ name: "CompA", contestants: [adamComp1], teams: [] } as CompetitionJsonData)
				: ({ name: "CompB", contestants: [adamComp2], teams: [] } as CompetitionJsonData),
		);

		const result = await calculateSerieScores(makeSerie());

		const adamResult = result["3boj"].find((r) => r.name === "Adam");
		expect(adamResult?.placements).toHaveLength(2);
		expect(adamResult?.total).toBe(55);
	});

	it("contestant missing from second comp → penalty placement (last+1, score 0)", async () => {
		// CompA: Adam (place 1, total 30), Bob (place 2, total 20)
		// CompB: Adam only (1 competitor) → Bob penalty = place 2, score 0
		const adamA = set3boj(makeContestant({ id: "adam", name: "Adam" }), 10, 10, 10);
		const bob = set3boj(makeContestant({ id: "bob", name: "Bob" }), 7, 7, 6);
		const adamB = set3boj(makeContestant({ id: "adam", name: "Adam" }), 8, 8, 9);

		vi.mocked(getCompData).mockImplementation(async (id) =>
			id === "comp1"
				? ({ name: "CompA", contestants: [adamA, bob], teams: [] } as CompetitionJsonData)
				: ({ name: "CompB", contestants: [adamB], teams: [] } as CompetitionJsonData),
		);

		const result = await calculateSerieScores(makeSerie());
		const bobResult = result["3boj"].find((r) => r.name === "Bob")!;

		expect(bobResult.placements).toHaveLength(2);
		const penalty = bobResult.placements.find((p) => p.score === 0)!;
		expect(penalty.place).toBe(2); // 1 competitor in CompB + 1
	});

	it("Puchar: sorted by place sum ascending", async () => {
		const adamA = set3boj(makeContestant({ id: "adam", name: "Adam" }), 10, 10, 10); // 30, place 1
		const bob = set3boj(makeContestant({ id: "bob", name: "Bob" }), 7, 7, 6);        // 20, place 2
		const adamB = set3boj(makeContestant({ id: "adam", name: "Adam" }), 8, 8, 9);    // 25, place 1

		vi.mocked(getCompData).mockImplementation(async (id) =>
			id === "comp1"
				? ({ name: "CompA", contestants: [adamA, bob], teams: [] } as CompetitionJsonData)
				: ({ name: "CompB", contestants: [adamB], teams: [] } as CompetitionJsonData),
		);

		const result = await calculateSerieScores(makeSerie({ type: SeriesTypes.puchar }));
		const boj3 = result["3boj"];

		// Adam: place sum = 1+1 = 2. Bob: place sum = 2+2 = 4. Adam wins.
		expect(boj3[0].name).toBe("Adam");
		expect(boj3[1].name).toBe("Bob");
	});

	it("Tury: sorted by total score descending", async () => {
		const adamA = set3boj(makeContestant({ id: "adam", name: "Adam" }), 10, 10, 10); // 30
		const bob = set3boj(makeContestant({ id: "bob", name: "Bob" }), 7, 7, 6);        // 20

		vi.mocked(getCompData).mockImplementation(async (id) =>
			id === "comp1"
				? ({ name: "CompA", contestants: [adamA, bob], teams: [] } as CompetitionJsonData)
				: ({ name: "CompB", contestants: [], teams: [] } as CompetitionJsonData),
		);

		const result = await calculateSerieScores(makeSerie({ competitionIds: ["comp1"], type: SeriesTypes.tury }));
		// total: Adam=30, Bob=20 → Adam first
		expect(result["3boj"][0].name).toBe("Adam");
	});
});

// --- calculateSerieTeamScores ---

describe("calculateSerieTeamScores", () => {
	it("team in two comps → placements aggregated", async () => {
		const m1 = set5boj(makeContestant({ id: "m1" }), 10); // 5boj = 50
		const m2 = set5boj(makeContestant({ id: "m2" }), 10); // 5boj = 50
		const team = makeTeam({ members: ["m1", "m2"] });

		vi.mocked(getCompData).mockResolvedValue({ name: "", contestants: [m1, m2], teams: [team] } as CompetitionJsonData);
		vi.mocked(getCompetitionInfo).mockImplementation(async (id) =>
			compInfo(id === "comp1" ? "CompA" : "CompB"),
		);

		const result = await calculateSerieTeamScores(makeSerie());
		const teamResult = result.find((r) => r.name === "TeamA")!;

		expect(teamResult.placements).toHaveLength(2);
		expect(teamResult.total).toBe(200); // 100 + 100
	});

	it("team missing from second comp → penalty placement", async () => {
		const m1 = set5boj(makeContestant({ id: "m1" }), 10);
		const m2 = set5boj(makeContestant({ id: "m2" }), 10);
		const m3 = set5boj(makeContestant({ id: "m3" }), 8);
		const m4 = set5boj(makeContestant({ id: "m4" }), 8);
		const teamA = makeTeam({ id: "t1", name: "TeamA", members: ["m1", "m2"] }); // total 100
		const teamB = makeTeam({ id: "t2", name: "TeamB", members: ["m3", "m4"] }); // total 80

		vi.mocked(getCompData).mockImplementation(async (id) =>
			id === "comp1"
				? ({ name: "", contestants: [m1, m2, m3, m4], teams: [teamA, teamB] } as CompetitionJsonData)
				: ({ name: "", contestants: [m1, m2], teams: [teamA] } as CompetitionJsonData),
		);
		vi.mocked(getCompetitionInfo).mockImplementation(async (id) =>
			compInfo(id === "comp1" ? "CompA" : "CompB"),
		);

		const result = await calculateSerieTeamScores(makeSerie());
		const teamBResult = result.find((r) => r.name === "TeamB")!;

		expect(teamBResult.placements).toHaveLength(2);
		const penalty = teamBResult.placements.find((p) => p.score === 0)!;
		// CompB has 1 Senior team (TeamA) → max count = 2 (CompA has 2), penalty = 3
		expect(penalty.place).toBe(3);
	});

	it("results sorted by place ascending", async () => {
		const m1 = set5boj(makeContestant({ id: "m1" }), 10);
		const m2 = set5boj(makeContestant({ id: "m2" }), 8);
		const teamA = makeTeam({ id: "t1", name: "TeamA", members: ["m1"] }); // total 50
		const teamB = makeTeam({ id: "t2", name: "TeamB", members: ["m2"] }); // total 40

		vi.mocked(getCompData).mockResolvedValue({ name: "", contestants: [m1, m2], teams: [teamA, teamB] } as CompetitionJsonData);
		vi.mocked(getCompetitionInfo).mockImplementation(async (id) =>
			compInfo(id === "comp1" ? "CompA" : "CompB"),
		);

		const result = await calculateSerieTeamScores(makeSerie());
		// TeamA: place sum = 1+1=2, TeamB: place sum = 2+2=4 → TeamA first
		expect(result[0].name).toBe("TeamA");
		expect(result[1].name).toBe("TeamB");
	});
});
