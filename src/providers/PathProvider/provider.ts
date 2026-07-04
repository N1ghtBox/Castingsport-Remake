import type { Thlon } from "@/types/Contestant";

export class PathProvider {
	static readonly home = "/" as const;
	static readonly menu = {
		competitions: "competitions/:year",
		series: "series/:year",
		settings: "settings",
	} as const;
	static readonly print = "print" as const;

	static readonly serie = {
		baseRouterPath: "serie/:serie",
		base: (serieId: string) => `serie/${serieId}`,
		teams: `summary/teams`,
		summaryRouterPath: `summary/:from/:to`,
		summary: (thlon: Thlon) => `summary/${thlon.from}/${thlon.to}`,
	} as const;

	static readonly competition = {
		baseRouterPath: "competition/:competition",
		base: (compId: string) => `competition/${compId}`,
		timeline: `timeline`,
		debug: `debug`,
		scoreTable: `scoreTable`,
		contestants: `contestants`,
		teams: `teams`,
		teamsSummary: `summary`,
		teamsSummaryPrint: `summary/print`,
		contestRouterPath: `contest/:contestId`,
		contest: (contestId: number) => `contest/${contestId}`,
		summaryRouterPath: `summary/:from/:to`,
		summary: (thlon: Thlon) => `summary/${thlon.from}/${thlon.to}`,
	} as const;
}
