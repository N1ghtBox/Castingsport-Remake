import { Contests } from "@/types/Contestant";
import type Competition from "./Competition";

export const defaultPlatformConfig = {
	[Contests.FlySkish]: 6,
	[Contests.Arenberg]: 6,
	[Contests.Skish]: 6,
	[Contests.FlyDistance]: 4,
	[Contests.Distance]: 4,
	[Contests.MultiSkish]: 6,
	[Contests.FlyDistanceDoubleHand]: 2,
	[Contests.DistanceDoubleHand]: 2,
	[Contests.MultiDistance]: 2,
};

export const DefaultCompetition = {
	id: "",
	name: "",
	place: "",
	logoUrl: "",
	dateFrom: new Date(),
	dateTo: new Date(),
	platformConfig: defaultPlatformConfig,
	timeConfig: {},
	mainJudge: "",
	secondaryJudge: "",
	orderConfig: {},
} as Competition;

