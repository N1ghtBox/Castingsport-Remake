import type { Moment } from "moment";
import type { Contests } from "./Contestant";

export type TimeConfig = Partial<Record<Contests, Moment>>;

export type OrderConfig = Record<number, Contests>;

export type PlatformConfig = Record<Contests, number>;

export type Competition = {
	id: string;
	name: string;
	dateFrom: Date;
	dateTo: Date;
	place: string;
	platformConfig: PlatformConfig;
	timeConfig: TimeConfig;
	orderConfig: OrderConfig;
	logoUrl: string;
	mainJudge: string;
	secondaryJudge: string;
};

