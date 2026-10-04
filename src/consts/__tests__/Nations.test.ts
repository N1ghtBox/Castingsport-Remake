import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
	AllNations,
	nationName,
	nationOptions,
	saveNationCodes,
} from "../Nations";

describe("Nations", () => {
	// Bogus codes are filtered out, so a short list means a typo crept into the code list.
	it("resolves every code to a name", () => {
		expect(AllNations.length).toBe(243);
	});

	it("names a code and tolerates an unset one", () => {
		expect(nationName("PL")).not.toBe("PL");
		expect(nationName(undefined)).toBe("");
	});
});

describe("nationOptions", () => {
	const store = new Map<string, string>();

	beforeAll(() => {
		vi.stubGlobal("window", {
			localStorage: {
				getItem: (key: string) => store.get(key) ?? null,
				setItem: (key: string, value: string) => store.set(key, value),
			},
		});
	});

	afterAll(() => vi.unstubAllGlobals());

	it("offers every country while the shortlist is empty", () => {
		store.clear();
		expect(nationOptions()).toEqual(AllNations);
	});

	it("offers only the shortlist once one is saved", () => {
		saveNationCodes(["PL", "DE"]);
		expect(nationOptions().map((x) => x.value)).toEqual(["PL", "DE"]);
	});

	it("falls back to every country on a corrupt entry", () => {
		store.set("nations", "{oops");
		expect(nationOptions()).toEqual(AllNations);
	});
});
