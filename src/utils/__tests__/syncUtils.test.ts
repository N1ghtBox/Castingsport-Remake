import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProgramConsts from "@/consts/Consts";
import { Contests } from "@/types/Contestant";
import {
	generateCompetitionSyncDocs,
	generateSyncData,
	type SyncOptions,
} from "../syncUtils";
import { makeContestant } from "./fixtures";

vi.mock("p-limit", () => ({
	default: () => (fn: () => Promise<unknown>) => fn(),
}));
vi.mock("@/providers/LoggingProvider/LoggingProvider", () => ({
	LoggingProvider: {
		LogData: vi.fn(),
		LogWarning: vi.fn(),
		LogInfo: vi.fn(),
		LogException: vi.fn(),
	},
}));
vi.mock("@/utils/jsonUtils", () => ({
	getCompData: vi.fn(),
	getCompetitionInfo: vi.fn(),
	getGeneralData: vi.fn(),
	updateGeneralData: vi.fn(),
}));

const options: SyncOptions = {
	name: "Zawody",
	date: "01-02 March 2026",
	competitionId: "comp",
};

let storage: Record<string, string> = {};

beforeEach(() => {
	storage = {};
	vi.stubGlobal("window", {
		localStorage: { getItem: (key: string) => storage[key] ?? null },
	});
});

afterEach(() => vi.unstubAllGlobals());

const saveFinals = (id: string, numbers: string[]) => {
	storage[ProgramConsts.Keys.FinalsResults(id)] = JSON.stringify({
		finals: numbers.map((number, i) => ({ number, score: `${10 - i}` })),
	});
};

describe("generateSyncData nation", () => {
	const contestants = [
		makeContestant({ id: "a", number: 1, nation: "PL" }),
		makeContestant({ id: "b", number: 2 }),
	];

	it("adds nation to contestants of an international competition", () => {
		const data = generateSyncData(contestants, [], {
			...options,
			isInternational: true,
		});

		expect(data.isInternational).toBe(true);
		expect(data.contestants.a.nation).toBe("PL");
		// No undefined field for Firestore to reject
		expect("nation" in data.contestants.b).toBe(false);
	});

	it("leaves nation out of a domestic competition", () => {
		const data = generateSyncData(contestants, [], options);

		expect(data.isInternational).toBe(false);
		expect("nation" in data.contestants.a).toBe(false);
	});
});

describe("generateSyncData subcategories", () => {
	const contestants = [
		makeContestant({ id: "a", number: 1, subcategories: ["open"] }),
		makeContestant({ id: "b", number: 2, subcategories: [] }),
	];
	const finalsId = (subcategoryId?: string) =>
		ProgramConsts.Keys.FinalsId("comp", Contests.Distance, "Mężczyzna", subcategoryId);

	it("limits results to the subcategory", () => {
		const data = generateSyncData(contestants, [], {
			...options,
			subcategoryId: "open",
		});

		expect(data.results["5boj"].Mężczyzna?.map((x) => x.id)).toEqual(["a"]);
		expect(Object.keys(data.contestants)).toEqual(["a"]);
	});

	it("reads finals saved for the subcategory", () => {
		saveFinals(finalsId(), ["2"]);
		saveFinals(finalsId("open"), ["1"]);

		const data = generateSyncData(contestants, [], {
			...options,
			subcategoryId: "open",
		});

		expect(data.finals[Contests.Distance]?.Mężczyzna?.map((x) => x.id)).toEqual(["a"]);
	});

	it("reads finals saved without a subcategory for the main document", () => {
		saveFinals(finalsId(), ["2"]);
		saveFinals(finalsId("open"), ["1"]);

		const data = generateSyncData(contestants, [], options);

		expect(data.finals[Contests.Distance]?.Mężczyzna?.map((x) => x.id)).toEqual(["b"]);
	});
});

describe("generateCompetitionSyncDocs", () => {
	const contestants = [
		makeContestant({ id: "a", number: 1, subcategories: ["open"] }),
		makeContestant({ id: "b", number: 2, subcategories: ["pl"] }),
	];

	it("syncs a competition without subcategories as one document", () => {
		const docs = generateCompetitionSyncDocs(contestants, [], undefined, options);

		expect(docs.map((x) => x.id)).toEqual(["comp"]);
		expect(docs[0].data.name).toBe("Zawody");
	});

	it("syncs only one document per subcategory", () => {
		const docs = generateCompetitionSyncDocs(
			contestants,
			[],
			[
				{ id: "open", name: "Open" },
				{ id: "pl", name: "Mistrzostwa Polski" },
			],
			options,
		);

		expect(docs.map((x) => x.id)).toEqual(["comp-open", "comp-pl"]);
		expect(docs.map((x) => x.data.name)).toEqual(["Open", "Mistrzostwa Polski"]);
		expect(Object.keys(docs[0].data.contestants)).toEqual(["a"]);
		expect(Object.keys(docs[1].data.contestants)).toEqual(["b"]);
	});
});

describe("generateSyncData debugOnly", () => {
	const contestants = [makeContestant()];

	it("marks a debug sync", () => {
		const data = generateSyncData(contestants, [], { ...options, debugOnly: true });

		expect(data.debugOnly).toBe(true);
	});

	it("leaves the field out of a normal sync", () => {
		const data = generateSyncData(contestants, [], options);

		expect("debugOnly" in data).toBe(false);
	});
});
