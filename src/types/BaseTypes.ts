import type { Prettify } from "node_modules/zod/dist/types/v4/core/util";
import type { WithPlace, WithScore } from "@/utils/typeUtils";

export type Placement = Prettify<
	WithPlace<
		WithScore<{
			competitionName: string;
		}>
	>
>;
