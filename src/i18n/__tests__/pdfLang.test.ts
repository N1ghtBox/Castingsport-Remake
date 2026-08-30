import { describe, expect, it } from "vitest";
import { pdfT, setPdfLang } from "../pdfLang";

describe("pdfT", () => {
	it("translates in the pdf language, independent of the app language", () => {
		setPdfLang("pl");
		expect(pdfT("table.place")).toBe("Miejsce");

		setPdfLang("en");
		expect(pdfT("table.place")).toBe("Place");
		expect(pdfT("thlon.n", { n: 5 })).toBe("5-event");

		setPdfLang("pl");
	});
});
