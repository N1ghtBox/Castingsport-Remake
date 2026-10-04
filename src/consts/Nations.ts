import ProgramConsts from "./Consts";

/**
 * ISO 3166-1 alpha-2 codes. Names come from the platform's Intl.DisplayNames, which follows the OS
 * locale — ponytail: no bundled name table to translate or keep up to date. Prints show the code.
 */
const CODES =
	"AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
		" ",
	);

const display = new Intl.DisplayNames(undefined, { type: "region" });

const FLAG_DIR = "/node_modules/svg-country-flags/png100px";

/** Bundled flag PNGs, keyed by path. PNG (not the SVG set) because react-pdf only draws bitmaps. */
const FLAGS = import.meta.glob<string>(
	"/node_modules/svg-country-flags/png100px/*.png",
	{ eager: true, query: "?url", import: "default" },
);

export const flagUrl = (code?: string) =>
	code ? FLAGS[`${FLAG_DIR}/${code.toLowerCase()}.png`] : undefined;

const pdfFlags = new Map<string, Promise<string>>();

/**
 * pdfkit mis-renders palette PNGs with a bit depth below 8 — Poland is 4-bit, Germany 2-bit, 53 of
 * the 256 flags in total. Redrawing through a canvas re-encodes them as 8-bit RGBA, which it draws
 * correctly. Browsers decode the originals fine, so this is only needed for the PDFs.
 */
export const flagForPdf = (code: string): Promise<string> => {
	const cached = pdfFlags.get(code);
	if (cached) return cached;

	const promise = new Promise<string>((resolve, reject) => {
		const image = new window.Image();
		image.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;
			canvas.getContext("2d")?.drawImage(image, 0, 0);
			resolve(canvas.toDataURL("image/png"));
		};
		image.onerror = reject;
		image.src = flagUrl(code) ?? "";
	});

	pdfFlags.set(code, promise);
	return promise;
};

export const nationName = (code?: string) =>
	code ? (display.of(code) ?? code) : "";

/** Unknown codes resolve to themselves, so a typo above drops out instead of shipping a raw code. */
export const AllNations = CODES.map((value) => ({
	value,
	label: display.of(value) ?? value,
}))
	.filter((x) => x.label !== x.value)
	.sort((a, b) => a.label.localeCompare(b.label));

/** The shortlist kept in Settings. Empty = not curated. */
export const savedNationCodes = (): string[] => {
	try {
		const saved = JSON.parse(
			window.localStorage.getItem(ProgramConsts.Keys.Nations) ?? "[]",
		);
		return Array.isArray(saved) ? saved : [];
	} catch {
		return [];
	}
};

export const saveNationCodes = (codes: string[]) =>
	window.localStorage.setItem(
		ProgramConsts.Keys.Nations,
		JSON.stringify(codes),
	);

/** What the contestant dropdown offers: the shortlist, or every country while there is none. */
export const nationOptions = () => {
	const codes = savedNationCodes();
	if (!codes.length) return AllNations;
	return codes.map((value) => ({ value, label: nationName(value) }));
};
