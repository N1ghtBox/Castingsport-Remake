import { useSyncExternalStore } from "react";
import i18n from "./config";

export type PdfLang = "pl" | "en";

let lang: PdfLang = i18n.language?.startsWith("en") ? "en" : "pl";
const listeners = new Set<() => void>();

/** Translate for PDF output only - independent of the app language. */
export const pdfT = (key: string, options?: Record<string, unknown>): string =>
	i18n.getFixedT(lang)(key as never, options as never) as unknown as string;

export const setPdfLang = (next: PdfLang) => {
	lang = next;
	for (const listener of listeners) listener();
};

export function usePdfLang() {
	const value = useSyncExternalStore(
		(onChange) => {
			listeners.add(onChange);
			return () => listeners.delete(onChange);
		},
		() => lang,
	);

	return [value, setPdfLang] as const;
}
