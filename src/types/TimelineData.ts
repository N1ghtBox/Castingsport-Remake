import type { Prettify } from "node_modules/zod/dist/types/v4/core/util";
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
