import { Contests } from "@/types/Contestant";

const ProgramConsts = {
	Keys: {
		LastSaveCategory: "lastCategoryAdded",
		LastActiveTab: "lastActiveTab",
	},
	DistanceMultiplier: 1.5,
	FinalMultiplier: 5,
	DebugModeEvent: "toggle-debug-mode",
	DefaultFinalCount: 6,
	DefaultSeriesConcurrency: 5,
	DefaultCompetition: {
		id: "",
		name: "",
		place: "",
		logoUrl: "",
		dateFrom: new Date(),
		dateTo: new Date(),
		platformConfig: {
			[Contests.FlySkish]: 6,
			[Contests.Arenberg]: 6,
			[Contests.Skish]: 6,
			[Contests.FlyDistance]: 4,
			[Contests.Distance]: 4,
			[Contests.MultiSkish]: 6,
			[Contests.FlyDistanceDoubleHand]: 2,
			[Contests.DistanceDoubleHand]: 2,
			[Contests.MultiDistance]: 2,
		},
		timeConfig: {},
		mainJudge: "",
		secondaryJudge: "",
		orderConfig: {},
	}
};

export default ProgramConsts;
