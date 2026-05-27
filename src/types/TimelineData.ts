import type { Prettify } from "@/utils/typeUtils";
import type { Contestant } from "./Contestant";

type EventId = number;
type PlatformId = number;

export type TimelineData = Record<
	EventId,
	Record<PlatformId, TimelineContestant[]>
>;

export type TimelineContestant = Prettify<
	{
		readonly order: number;
	} & Pick<Contestant, "name" | "number" | "category" | "club">
>;
