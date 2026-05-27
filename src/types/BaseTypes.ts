import type { Prettify } from "@/utils/typeUtils";
import type { WithPlace, WithScore } from "@/utils/typeUtils";

export type Placement = Prettify<
	WithPlace<
		WithScore<{
			competitionName: string;
		}>
	>
>;
