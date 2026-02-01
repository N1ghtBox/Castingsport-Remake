export type Series = {
	id: string;
	name: string;
	competitionIds: string[];
	year: number;
	type: number;
};

export const SeriesTypes = {
	puchar: "Puchar",
	tury: "Tury"
} 
