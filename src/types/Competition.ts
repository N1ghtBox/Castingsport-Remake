import type { Moment } from "moment";
import type { Contests } from "./Contestant";

export type TimeConfig = Partial<Record<Contests, Moment>>;

export type OrderConfig = Record<number, Contests>;

export type PlatformConfig = Record<Contests, number>;

export type EventDurationConfig = Partial<Record<Contests, number>>;

export enum CompetitionStatus {
	NotStarted = "notStarted",
	InProgress = "inProgress",
	Closed = "closed",
	Cancelled = "cancelled",
}

export type Competition = {
	id: string;
	name: string;
	dateFrom: Date;
	dateTo: Date;
	place: string;
	platformConfig: PlatformConfig;
	timeConfig: TimeConfig;
	orderConfig: OrderConfig;
	eventDurationConfig?: EventDurationConfig;
	eventCooldown?: number;
	logoUrl: string;
	mainJudge: string;
	secondaryJudge: string;
	lastSynced?: string;
	// Optional for backwards compatibility – competitions saved before statuses existed have none.
	status?: CompetitionStatus;
};

// Legacy competitions without a status keep the previous behaviour (always synced).
export const getCompetitionStatus = (comp: Pick<Competition, "status">): CompetitionStatus =>
	comp.status ?? CompetitionStatus.InProgress;

