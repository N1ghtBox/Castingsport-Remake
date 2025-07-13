import type { Contestant } from "./Contestant";

type EventId = number;
type PlatformId = number;

export type TimelineData = Record<
	EventId,
	Record<PlatformId, TimelineContestant[]>
>;

export type TimelineContestant = {
	readonly order: number;
} & Pick<Contestant, "name" | "number" | "category" | "club">;
