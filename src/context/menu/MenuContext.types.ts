import type { Competition } from "@/types/Competition";
import type { Series } from "@/types/Series";

export type MenuContextProps = {
	competitions: Array<Competition>;
	series: Array<Series>;
	refresh: () => Promise<void>;
};
